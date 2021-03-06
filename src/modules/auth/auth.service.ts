import { HttpService, Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { MailerService } from '@nestjs-modules/mailer';
import { DeleteResult, ObjectType, Repository } from 'typeorm';
import * as randToken from 'rand-token';
import * as dayjs from 'dayjs';

import { UsersService } from '../users/users.service';
import { User } from '../users/users.entity';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { TokenType } from './enums/token-type.enum';
import { Token } from './entities/token.entity';
import { createEntityInstance } from '../../shared/utils/create-entity-instance.util';
import { TokenResponse } from './entities/access-token-response.entity';
import { Cookies } from '../../constants';
import { EmailConfirm } from './entities/email-confirm.entity';
import { PasswordReset } from './entities/password-reset.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly mailerService: MailerService,

    @InjectRepository(Token)
    private readonly tokensRepository: Repository<Token>,

    @InjectRepository(EmailConfirm)
    private readonly emailConfirmsRepository: Repository<EmailConfirm>,

    @InjectRepository(PasswordReset)
    private readonly passwordResetsRepository: Repository<PasswordReset>,
  ) {}

  private readonly RECAPTCHA_API_URL = 'https://www.google.com/recaptcha/api/siteverify';

  async validateReCaptcha(recaptcha: string): Promise<boolean> {
    const data = {
      response: recaptcha,
      secret: process.env.NODE_ENV === 'production'
        ? this.configService.get<string>('RECAPTCHA_KEY')
        : '6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe',
    };

    const request = `${this.RECAPTCHA_API_URL}?secret=${data.secret}&response=${data.response}`;
    const result = await this.httpService.get(request).toPromise();

    return !!result.data.success;
  }

  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.usersService.findOneByEmail(email);
    if (user && await user.compareHash(password)) {
      user.hidePassword();
      return user;
    }
    return null;
  }

  async createAndGetRefreshToken(user: User) {
    const refreshToken = randToken.generate(255);
    const refreshExpiresIn = this.configService.get<number>('jwt.refreshExpiresIn');
    const refreshEntityData = {
      key: refreshToken,
      user: Promise.resolve(user),
      expiresOn: dayjs().add(refreshExpiresIn, 'second').toDate(),
    };
    const refreshData = createEntityInstance<Token>(Token, refreshEntityData);
    await this.tokensRepository.save(refreshData);

    return refreshToken;
  }

  async createAndGetAccessToken(user: User) {
    const expiresIn = `${this.configService.get<number>('jwt.expiresIn')}s`;
    const payload: JwtPayload = {
      email: user.email,
      sub: user.id
    };

    return this.jwtService.sign(payload, { expiresIn });
  }

  async getAccessToken(user: User): Promise<TokenResponse> {
    const expiresIn = this.configService.get<number>('jwt.expiresIn');
    const accessToken = await this.createAndGetAccessToken(user);

    return {
      tokenType: TokenType.Bearer,
      accessToken,
      expiresIn,
    };
  }

  async getRefreshTokenCookie(user: User): Promise<string> {
    const refreshToken = await this.createAndGetRefreshToken(user);
    const refreshExpiresIn = this.configService.get<number>('jwt.refreshExpiresIn');
    const secure = process.env.NODE_ENV === 'production' ? 'Secure;' : '';

    return `${Cookies.REFRESH_TOKEN}=${refreshToken}; HttpOnly; ${secure} Path=/; Max-Age=${refreshExpiresIn}`;
  }

  async findOneToken(key: string): Promise<Token> {
    return this.tokensRepository.findOneOrFail({
      where: {
        key,
      },
      relations: [
        'user',
      ]
    });
  }

  async deleteOneTokenById(id: string | number): Promise<DeleteResult> {
    return this.tokensRepository.delete(id);
  }

  @Cron('0 */2 * * *')
  async handleCleanup() {
    const cleanup = async <T>(repository: Repository<T>, entityTarget: ObjectType<T>) => (
      repository
        .createQueryBuilder()
        .delete()
        .from(entityTarget)
        .where("expiresOn < NOW()")
        .execute()
    );

    return Promise.all([
      cleanup(this.tokensRepository, Token),
      cleanup(this.passwordResetsRepository, PasswordReset),
      cleanup(this.emailConfirmsRepository, EmailConfirm),
    ]);
  }
}
