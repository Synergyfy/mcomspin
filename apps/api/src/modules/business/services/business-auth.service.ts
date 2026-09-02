import { Injectable, ConflictException, UnauthorizedException, BadRequestException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';
import { BusinessRegisterDto } from '../dto/business-register.dto';
import { BusinessVerifyDto } from '../dto/business-verify.dto';
import { Role } from '../../../common/constants/roles.constant';

@Injectable()
export class BusinessAuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(dto: BusinessRegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) throw new ConflictException('Email already registered');

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.contactName,
        lastName: '',
        phone: dto.phone,
        roles: {
          create: {
            role: {
              connectOrCreate: {
                where: { name: Role.BusinessOwner as any },
                create: { name: Role.BusinessOwner as any, isSystem: true },
              },
            },
          },
        },
      },
    });

    const slug = dto.businessName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const business = await this.prisma.business.create({
      data: {
        ownerId: user.id,
        name: dto.businessName,
        slug: `${slug}-${user.id.slice(0, 8)}`,
        contactEmail: dto.email,
        contactPhone: dto.phone,
        metadata: { businessType: dto.businessType },
      },
    });

    const tokens = await this.generateTokens(user.id, user.email);
    return { ...tokens, business };
  }

  async verify(dto: BusinessVerifyDto) {
    const stored = await this.prisma.otpVerification.findFirst({
      where: {
        code: dto.code,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!stored) throw new BadRequestException('Invalid or expired verification code');

    await this.prisma.otpVerification.update({
      where: { id: stored.id },
      data: { usedAt: new Date() },
    });

    if (stored.email) {
      await this.prisma.user.updateMany({
        where: { email: stored.email },
        data: { isEmailVerified: true },
      });
    }
    if (stored.phone) {
      await this.prisma.user.updateMany({
        where: { phone: stored.phone },
        data: { isPhoneVerified: true },
      });
    }

    let business = stored.email
      ? await this.prisma.business.findFirst({
          where: { contactEmail: stored.email },
        })
      : null;

    if (!business) {
      throw new NotFoundException(
        'No business found for the verified contact. Please register the business first.',
      );
    }

    const verification = await this.prisma.businessVerification.upsert({
      where: { businessId: business.id },
      create: {
        businessId: business.id,
        status: 'Pending',
        documents: {
          registrationNumber: dto.registrationNumber,
          website: dto.website,
          socialMedia: dto.socialMedia,
        },
      },
      update: {
        status: 'Pending',
        documents: {
          registrationNumber: dto.registrationNumber,
          website: dto.website,
          socialMedia: dto.socialMedia,
        },
      },
    });

    return {
      message: 'Verification submitted',
      verificationId: verification.id,
      status: verification.status,
    };
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
