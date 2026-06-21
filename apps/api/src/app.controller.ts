import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  async health() {
    return this.appService.health();
  }

  @Get('health/ready')
  async healthReady() {
    return this.appService.healthReady();
  }

  @Get('health/live')
  async healthLive() {
    return this.appService.healthLive();
  }

  @Get('health/db')
  async healthDb() {
    return this.appService.healthDb();
  }

  @Get('health/queue')
  async healthQueue() {
    return this.appService.healthQueue();
  }
}
