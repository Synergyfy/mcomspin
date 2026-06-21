import { Injectable, ConflictException, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SendOtpDto } from './dto/send-otp.dto';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { SocialLoginDto } from './dto/social-login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { Role } from '../../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  private otpStore = new Map<string, { code: string; expiresAt: Date; email?: string; phone?: string }>();

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        roles: {
          create: {
            role: {
              connectOrCreate: {
                where: { name: Role.Customer },
                create: { name: Role.Customer, isSystem: true },
              },
            },
          },
        },
      },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: true } } },
    });

    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateTokens(user.id, user.email);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret'),
      });

      const session = await this.prisma.session.findUnique({
        where: { refreshToken: payload.jti },
      });

      if (!session || session.isRevoked) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      await this.prisma.session.update({
        where: { id: session.id },
        data: { isRevoked: true },
      });

      return this.generateTokens(payload.sub, payload.email);
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  async logout(userId: string, refreshToken?: string) {
    if (refreshToken) {
      await this.prisma.session.updateMany({
        where: { refreshToken, userId },
        data: { isRevoked: true },
      });
    } else {
      await this.prisma.session.updateMany({
        where: { userId, isRevoked: false },
        data: { isRevoked: true },
      });
    }
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, email: true, phone: true, firstName: true, lastName: true,
        avatarUrl: true, isEmailVerified: true, isPhoneVerified: true,
        roles: { include: { role: { select: { name: true } } } },
        ownedBusinesses: { select: { id: true, name: true, slug: true } },
      },
    });
    if (!user) throw new UnauthorizedException('User not found');
    return {
      ...user,
      roles: user.roles.map((r) => r.role.name),
    };
  }

  async sendOtp(dto: SendOtpDto) {
    if (!dto.email && !dto.phone) throw new BadRequestException('Email or phone required');

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const sessionId = crypto.randomUUID();

    this.otpStore.set(sessionId, {
      code,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      email: dto.email,
      phone: dto.phone,
    });

    return { sessionId, message: 'OTP sent successfully' };
  }

  async verifyOtp(dto: VerifyOtpDto) {
    const stored = this.otpStore.get(dto.sessionId);
    if (!stored) throw new BadRequestException('Invalid session');
    if (new Date() > stored.expiresAt) throw new BadRequestException('OTP expired');
    if (stored.code !== dto.code) throw new BadRequestException('Invalid OTP');

    this.otpStore.delete(dto.sessionId);

    let user = stored.email
      ? await this.prisma.user.findUnique({ where: { email: stored.email } })
      : null;

    if (user) return this.generateTokens(user.id, user.email);

    const tempToken = this.jwtService.sign(
      { email: stored.email, phone: stored.phone, otpVerified: true },
      { secret: this.configService.get('JWT_ACCESS_SECRET', 'access-secret'), expiresIn: '15m' },
    );

    return { tempToken, requiresProfile: true };
  }

  async socialLogin(dto: SocialLoginDto) {
    const email = dto.email;
    if (email) {
      let user = await this.prisma.user.findUnique({ where: { email } });
      if (!user) {
        user = await this.prisma.user.create({
          data: {
            email,
            firstName: dto.firstName || 'User',
            lastName: dto.lastName || '',
            passwordHash: '',
            isEmailVerified: true,
            roles: { create: { role: { connectOrCreate: { where: { name: Role.Customer }, create: { name: Role.Customer, isSystem: true } } } } },
          },
        });
      }
      return this.generateTokens(user.id, user.email);
    }

    const tempToken = this.jwtService.sign(
      { provider: dto.provider, socialAccessToken: dto.accessToken, requiresProfile: true },
      { secret: this.configService.get('JWT_ACCESS_SECRET', 'access-secret'), expiresIn: '15m' },
    );

    return { tempToken, requiresProfile: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetTokenHash = await bcrypt.hash(resetToken, 6);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { metadata: { ...((user.metadata as any) || {}), resetTokenHash, resetTokenExpiry: new Date(Date.now() + 60 * 60 * 1000) } },
    });

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const users = await this.prisma.user.findMany({ take: 100 });

    for (const user of users) {
      const meta = user.metadata as any;
      if (!meta?.resetTokenHash) continue;
      if (new Date(meta.resetTokenExpiry) < new Date()) continue;
      if (await bcrypt.compare(dto.token, meta.resetTokenHash)) {
        const passwordHash = await bcrypt.hash(dto.newPassword, 12);
        const { resetTokenHash, resetTokenExpiry, ...rest } = meta;
        await this.prisma.user.update({
          where: { id: user.id },
          data: { passwordHash, metadata: rest },
        });
        return { message: 'Password reset successfully' };
      }
    }

    throw new BadRequestException('Invalid or expired reset token');
  }

  private async generateTokens(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: { include: { permissions: true } } } } },
    });

    const roles = user?.roles.map((ur) => ur.role.name) || [];
    const permissions =
      user?.roles.flatMap((ur) =>
        ur.role.permissions.map((p) => `${p.resource}:${p.action}`),
      ) || [];

    const accessToken = this.jwtService.sign(
      { sub: userId, email, roles, permissions },
      {
        secret: this.configService.get('JWT_ACCESS_SECRET', 'access-secret'),
        expiresIn: '15m',
      },
    );

    const refreshTokenId = crypto.randomUUID();
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, jti: refreshTokenId },
      {
        secret: this.configService.get('JWT_REFRESH_SECRET', 'refresh-secret'),
        expiresIn: '7d',
      },
    );

    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    await this.prisma.session.create({
      data: {
        userId,
        refreshToken: refreshTokenId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken, user: { id: userId, email, roles } };
  }
}
