import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { UnauthorizedException, UsePipes, ValidationPipe } from '@nestjs/common';

import { LoginInput } from './dto/login.input';
import { TokenResponse } from './token-response.entity';
import { AuthService } from './auth.service';

@Resolver(of => TokenResponse)
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Mutation(returns => TokenResponse)
  async login(@Args('loginData') loginData: LoginInput): Promise<TokenResponse> {
    const user = await this.authService.validateUser(loginData.email, loginData.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return await this.authService.login(user);
  }
}
