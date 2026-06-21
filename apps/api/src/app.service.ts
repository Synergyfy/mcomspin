import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'MCOMSpin API is running!';
  }

  async health() {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  }

  async healthReady() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ok', database: 'connected', timestamp: new Date().toISOString() };
    } catch (e) {
      return { status: 'error', database: 'disconnected', message: (e as Error).message };
    }
  }

  async healthLive() {
    return { status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() };
  }

  async healthDb() {
    try {
      const start = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      const latency = Date.now() - start;
      return { status: 'ok', database: 'connected', latencyMs: latency, timestamp: new Date().toISOString() };
    } catch (e) {
      return { status: 'error', database: 'disconnected', message: (e as Error).message, timestamp: new Date().toISOString() };
    }
  }

  async healthQueue() {
    return { status: 'ok', queue: 'not_configured', timestamp: new Date().toISOString() };
  }
}
