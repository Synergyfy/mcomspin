import { Injectable, ConflictException, UnauthorizedException, NotFoundException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerRegisterDto } from '../dto/customer-register.dto';
import { CustomerLoginDto } from '../dto/customer-login.dto';
import { ForgotPasswordDto } from '../dto/forgot-password.dto';
import { ResetPasswordDto } from '../dto/reset-password.dto';
import { Role } from '../../../common/constants/roles.constant';

@Injectable()
export class CustomerAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(dto: CustomerRegisterDto) {
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
                where: { name: Role.Customer as any },
                create: { name: Role.Customer as any, isSystem: true },
              },
            },
          },
        },
      },
      include: { roles: { include: { role: true } } },
    });

    return this.generateTokens(user.id, user.email);
  }

  async login(dto: CustomerLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      include: { roles: { include: { role: true } } },
    });
    if (!user || !user.isActive) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(dto.password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const isCustomer = user.roles.some((ur) => ur.role.name === Role.Customer);
    if (!isCustomer) throw new UnauthorizedException('Invalid credentials');

    await this.prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() },
    });

    return this.generateTokens(user.id, user.email);
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) return { message: 'If the email exists, a reset link has been sent' };

    const resetToken = this.jwtService.sign(
      { sub: user.id, type: 'password_reset' },
      { secret: this.configService.get('JWT_RESET_SECRET', 'reset-secret'), expiresIn: '15m' },
    );

    const resetUrl = `${this.configService.get('WEB_APP_URL', 'http://localhost:3000')}/auth/reset-password?token=${resetToken}`;

    try {
      // Attempt to deliver via configured mail provider when present.
      const mailerEnabled = this.configService.get('MAIL_ENABLED') === 'true';
      if (mailerEnabled) {
        // const mailer = ...; await mailer.send(...);
        await this.prisma.notification.create({
          data: {
            userId: user.id,
            type: 'Transactional',
            channel: 'Email',
            title: 'Password reset',
            body: `Reset your password here: ${resetUrl}`,
            data: { resetUrl },
          },
        });
      } else {
        // Fallback: deliver the reset link as an in-app notification so the
        // flow is functional without an external email provider configured.
        await this.prisma.notification.create({
          data: {
            userId: user.id,
            type: 'Transactional',
            channel: 'InApp',
            title: 'Password reset link',
            body: `Reset your password here: ${resetUrl}`,
            data: { resetUrl },
          },
        });
      }
    } catch {
      // Never leak whether the account exists; delivery failures are silent.
    }

    return { message: 'If the email exists, a reset link has been sent' };
  }

  async resetPassword(dto: ResetPasswordDto) {
    try {
      const payload = this.jwtService.verify(dto.token, {
        secret: this.configService.get('JWT_RESET_SECRET', 'reset-secret'),
      });
      if (payload.type !== 'password_reset') throw new Error();

      const passwordHash = await bcrypt.hash(dto.newPassword, 12);
      await this.prisma.user.update({
        where: { id: payload.sub },
        data: { passwordHash },
      });

      return { message: 'Password reset successfully' };
    } catch {
      throw new BadRequestException('Invalid or expired reset token');
    }
  }

  private async generateTokens(userId: string, email: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { roles: { include: { role: true } } },
    });

    const roles = user?.roles.map((ur) => ur.role.name) || [];

    const accessToken = this.jwtService.sign(
      { sub: userId, email, roles },
      { expiresIn: '15m' },
    );

    const refreshToken = this.jwtService.sign(
      { sub: userId, email, jti: crypto.randomUUID() },
      { expiresIn: '7d' },
    );

    return { accessToken, refreshToken, user: { id: userId, email, roles } };
  }
}
