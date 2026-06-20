import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Role } from '../../common/constants/roles.constant';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

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
