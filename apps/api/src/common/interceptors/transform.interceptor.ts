import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  meta?: Record<string, any>;
  error?: { code: string; message: string; details?: any };
}

@Injectable()
export class TransformInterceptor<T> implements NestInterceptor<T, ApiResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        if (data && typeof data === 'object' && 'success' in data) {
          return data;
        }
        if (data && typeof data === 'object' && 'meta' in data && 'data' in data) {
          return { success: true, ...data };
        }
        return { success: true, data };
      }),
    );
  }
}
