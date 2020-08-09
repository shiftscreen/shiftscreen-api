import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
  UsePipes,
  ValidationPipe
} from '@nestjs/common';
import * as dayjs from 'dayjs';

import { LoginInput } from './dto/login.input';
import { AuthService } from './auth.service';
import { Token } from './entities/token.entity';
import { TokenResponse } from './entities/access-token-response.entity';
import { COOKIES } from '../../constants';

@Resolver(of => Token)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Mutation(returns => TokenResponse)
  async login(
    @Args('loginData') loginData: LoginInput,
    @Context() context: any,
  ): Promise<TokenResponse> {
    const captchaValid = await this.authService.validateReCaptcha(loginData.recaptcha);
    if (!captchaValid) {
      throw new BadRequestException();
    }

    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException();
    }

    const cookie = await this.authService.getRefreshTokenCookie(user);
    context.res.setHeader('Set-Cookie', cookie);

    return await this.authService.getAccessToken(user);
  }

  @Mutation(returns => TokenResponse, { nullable: true })
  async refreshToken(
    @Context() context: any,
  ): Promise<TokenResponse> {
    const key = context.req.cookies?.[COOKIES.REFRESH_TOKEN];
    if (!key) {
      throw new BadRequestException();
    }

    const token = await this.authService.findOneToken(key);
    const valid = dayjs(token?.expiresOn).isAfter(dayjs());

    if (!token || !valid) {
      throw new ForbiddenException();
    }

    return this.authService.getAccessToken(await token.user);
  }

  @Mutation(returns => Boolean)
  async revokeToken(
    @Context() context: any,
  ): Promise<boolean> {
    const key = context.req.cookies?.[COOKIES.REFRESH_TOKEN];
    if (!key) {
      throw new BadRequestException();
    }

    const token = await this.authService.findOneToken(key);
    if (!token) {
      throw new ForbiddenException();
    }

    context.res.clearCookie(COOKIES.REFRESH_TOKEN);

    const deleteResults = await this.authService.deleteOneTokenById(token.id);
    return deleteResults.affected && deleteResults.affected > 0;
  }
}
