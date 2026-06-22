import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  Logger,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class AuditInterceptor implements NestInterceptor {
  private readonly logger = new Logger('Audit');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url } = request;
    const user = request.user;

    if (['POST', 'PATCH', 'PUT', 'DELETE'].includes(method)) {
      const start = Date.now();
      return next.handle().pipe(
        tap(() => {
          const duration = Date.now() - start;
          this.logger.log(
            JSON.stringify({
              action: `${method} ${url}`,
              userId: user?.id || 'anonymous',
              duration,
              timestamp: new Date().toISOString(),
            }),
          );
        }),
      );
    }

    return next.handle();
  }
}
