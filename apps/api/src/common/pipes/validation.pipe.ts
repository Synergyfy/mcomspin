import {
  Injectable,
  ValidationPipe as NestValidationPipe,
  ValidationError,
  BadRequestException,
} from '@nestjs/common';

@Injectable()
export class ValidationPipe extends NestValidationPipe {
  constructor() {
    super({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      exceptionFactory: (errors: ValidationError[]) => {
        const formatted = errors.map((e) => ({
          field: e.property,
          constraints: e.constraints ? Object.values(e.constraints) : [],
          children: e.children?.length
            ? e.children.map((c) => ({
                field: `${e.property}.${c.property}`,
                constraints: c.constraints ? Object.values(c.constraints) : [],
              }))
            : [],
        }));
        return new BadRequestException({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Validation failed', details: formatted },
        });
      },
    });
  }
}
