import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { Public } from './common/decorators/public.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Public()
  @Get('health')
  async health() {
    return this.appService.health();
  }

  @Public()
  @Get('health/ready')
  async healthReady() {
    return this.appService.healthReady();
  }

  @Public()
  @Get('health/live')
  async healthLive() {
    return this.appService.healthLive();
  }

  @Public()
  @Get('health/db')
  async healthDb() {
    return this.appService.healthDb();
  }

  @Public()
  @Get('health/queue')
  async healthQueue() {
    return this.appService.healthQueue();
  }
}
