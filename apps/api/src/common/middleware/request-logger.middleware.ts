import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RequestLoggerMiddleware implements NestMiddleware {
  private readonly logger = new Logger('Request');

  use(req: Request, res: Response, next: NextFunction) {
    const { method, originalUrl } = req;
    const start = Date.now();

    res.on('finish', () => {
      const duration = Date.now() - start;
      const userId = (req as any).user?.id || 'anonymous';
      this.logger.log(
        `${method} ${originalUrl} ${res.statusCode} ${duration}ms [user:${userId}]`,
      );
    });

    next();
  }
}
