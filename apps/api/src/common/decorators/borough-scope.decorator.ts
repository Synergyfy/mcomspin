import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const BoroughScope = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user?.boroughId;
  },
);
