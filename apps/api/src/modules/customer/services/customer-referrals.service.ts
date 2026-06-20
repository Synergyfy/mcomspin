import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { CustomerCreateReferralDto } from '../dto/customer-create-referral.dto';

@Injectable()
export class CustomerReferralsService {
  constructor(private prisma: PrismaService) {}

  async create(customerId: string, dto: CustomerCreateReferralDto) {
    const invitee = await this.prisma.user.findUnique({ where: { email: dto.inviteeEmail } });
    if (invitee) throw new ConflictException('User already registered');

    const user = await this.prisma.user.findUnique({ where: { id: customerId } });
    if (!user) throw new ConflictException('User not found');

    const referralCode = `REF-${user.firstName.substring(0, 3).toUpperCase()}-${customerId.slice(0, 6)}`;

    await this.prisma.customerActivityLog.create({
      data: {
        customerId,
        activityType: 'Share',
        description: `Invited ${dto.inviteeEmail}${dto.message ? `: ${dto.message}` : ''}`,
        entityType: 'Referral',
        metadata: { referralCode, inviteeEmail: dto.inviteeEmail },
      },
    });

    return {
      referralCode,
      inviteeEmail: dto.inviteeEmail,
      message: 'Referral sent successfully',
    };
  }

  async getReferrals(customerId: string) {
    const referrals = await this.prisma.customerActivityLog.findMany({
      where: { customerId, activityType: 'Share', entityType: 'Referral' },
      orderBy: { createdAt: 'desc' },
    });

    const sentCount = referrals.length;
    const joinedCount = 0;

    const user = await this.prisma.user.findUnique({ where: { id: customerId } });
    const referralCode = `REF-${user?.firstName?.substring(0, 3).toUpperCase() || 'USR'}-${customerId.slice(0, 6)}`;

    return {
      referralCode,
      referralLink: `https://mcomspin.com/ref/${referralCode}`,
      stats: { sent: sentCount, joined: joinedCount },
      referrals: referrals.map((r) => ({
        email: (r.metadata as any)?.inviteeEmail || 'unknown',
        status: 'invited',
        date: r.createdAt,
      })),
    };
  }
}
