import { createParamDecorator, UnauthorizedException } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  async (data, [root, args, ctx, info]) => await ctx.req.user,
);
