import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { MailerModule } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

import { RolesModule } from './modules/roles/roles.module';
import { ScreensModule } from './modules/screens/screens.module';
import { SlidesModule } from './modules/slides/slides.module';
import { FilesModule } from './modules/files/files.module';
import { FilesKeysModule } from './modules/files-keys/files-keys.module';
import { StoragesModule } from './modules/storages/storages.module';
import { MinioModule } from './modules/minio/minio.module';
import { AppsInstancesModule } from './modules/apps-instances/apps-instances.module';
import { OrganizationsModule } from './modules/organizations/organizations.module';
import { UtilsModule } from './modules/utils/utils.module';
import { ScreensKeysModule } from './modules/screens-keys/screens-keys.module';

import typeormConfig from './config/typeorm.config';
import graphqlConfig from './config/graphql.config';
import mailConfig from './config/mail.config';
import { PubSubModule } from './modules/pubsub/pubsub.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forFeature(typeormConfig)],
      useFactory: async (configService: ConfigService) => (
        configService.get<TypeOrmModuleOptions>('typeorm')
      ),
      inject: [ConfigService],
    }),
    GraphQLModule.forRootAsync({
      imports: [ConfigModule.forFeature(graphqlConfig)],
      useFactory: async (configService: ConfigService) => (
        configService.get('graphql')
      ),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      imports: [ConfigModule.forFeature(mailConfig)],
      useFactory: async (configService: ConfigService) => ({
        transport: configService.get('mail.transport'),
        defaults: {
          from:'"shiftscreen" <noreply@shiftscreen.pl>',
        },
        template: {
          dir: __dirname + '/templates',
          adapter: new PugAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),
    ConfigModule.forRoot(),
    ScheduleModule.forRoot(),
    AuthModule,
    UsersModule,
    RolesModule,
    ScreensModule,
    SlidesModule,
    FilesModule,
    FilesKeysModule,
    StoragesModule,
    MinioModule,
    AppsInstancesModule,
    OrganizationsModule,
    UtilsModule,
    ScreensKeysModule,
    PubSubModule
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
