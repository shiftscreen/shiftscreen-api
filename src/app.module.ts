import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

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
import { Providers } from './constants';
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
    ConfigModule.forRoot(),
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
