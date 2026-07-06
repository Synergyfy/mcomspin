import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromBodyField('refreshToken'),
        (req) => req?.cookies?.refreshToken,
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_REFRESH_SECRET', 'refresh-secret'),
    });
  }

  async validate(payload: any) {
    const session = await this.prisma.session.findUnique({
      where: { refreshToken: payload.jti },
      include: {
        user: {
          include: { roles: { include: { role: { include: { permissions: true } } } } },
        },
      },
    });

    if (!session || session.isRevoked) {
      throw new UnauthorizedException('Invalid or revoked refresh token');
    }

    if (new Date() > session.expiresAt) {
      throw new UnauthorizedException('Refresh token expired');
    }

    return session.user;
  }
}
