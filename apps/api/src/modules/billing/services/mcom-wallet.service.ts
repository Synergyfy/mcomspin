import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class McomWalletService {
  constructor(private readonly prisma: PrismaService) {}

  async createHold(userId: string, amount: number, idempotencyKey: string) {
    if (!amount || amount <= 0) {
      throw new BadRequestException('Hold amount must be greater than zero');
    }
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min hold
    const holdId = `hold_${idempotencyKey.slice(0, 16)}_${Date.now()}`;

    return {
      holdId,
      userId,
      amount,
      expiresAt: expiresAt.toISOString(),
      status: 'RESERVED',
    };
  }

  async captureHold(userId: string, holdId: string, idempotencyKey: string) {
    if (!holdId) {
      throw new BadRequestException('Invalid hold ID');
    }

    const transactionId = `tx_wallet_${idempotencyKey.slice(0, 16)}_${Date.now()}`;
    return {
      ok: true,
      transactionId,
      status: 'CAPTURED',
    };
  }
}
