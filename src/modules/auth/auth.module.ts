import { forwardRef, HttpModule, HttpService, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { LocalStrategy } from './strategies/local.strategy';

import { JwtStrategy } from './strategies/jwt.strategy';
import { Token } from './entities/token.entity';
import jwtConfig from '../../config/jwt.config';

@Module({
  imports: [
    HttpModule,
    PassportModule,
    TypeOrmModule.forFeature([Token]),
    ConfigModule.forFeature(jwtConfig),
    forwardRef(() => UsersModule),
    JwtModule.registerAsync({
      imports: [ConfigModule.forFeature(jwtConfig)],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('jwt.secret'),
        signOptions: {
          expiresIn: configService.get<number>('jwt.expiresIn'),
        }
      }),
      inject: [ConfigService]
    }),
  ],
  providers: [
    AuthService,
    ConfigService,
    JwtStrategy,
    LocalStrategy,
    AuthResolver,
    TypeOrmModule,
  ],
  exports: [AuthService],
})
export class AuthModule {}
