import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenResponse } from './token-response.entity';
import { TokenType } from './enums/token-type.enum';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await user.compareHash(password)) {
      user.hidePassword();
      return user;
    }
    return null;
  }

  async login(user: User) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id
    };

    const data: TokenResponse = {
      accessToken: this.jwtService.sign(payload),
      tokenType: TokenType.Bearer,
      expiresIn: this.configService.get('jwt.expiresIn'),
    };

    return data;
  }
}
