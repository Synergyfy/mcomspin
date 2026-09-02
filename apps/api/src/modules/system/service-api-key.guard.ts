import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { timingSafeEqual } from 'crypto';

/**
 * Guards the /system endpoints used by the MCOM Solutions GenericHttpConnector.
 * Verifies the `x-mcom-solution-api-key` header matches MCOM_API_KEY.
 */
@Injectable()
export class ServiceApiKeyGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const expected = this.config.get<string>('MCOM_API_KEY', '');
    const provided: unknown = request.headers['x-mcom-solution-api-key'];

    if (!expected || typeof provided !== 'string' || provided.length === 0) {
      throw new UnauthorizedException('Missing service API key');
    }

    const a = Buffer.from(provided);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid service API key');
    }

    return true;
  }
}
