import { Module } from '@nestjs/common';
import { SystemController } from './system.controller';
import { SystemService } from './system.service';
import { ServiceApiKeyGuard } from './service-api-key.guard';

@Module({
  controllers: [SystemController],
  providers: [SystemService, ServiceApiKeyGuard],
  exports: [SystemService],
})
export class SystemModule {}
