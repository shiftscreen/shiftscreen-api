import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';

import { RolesModule } from './modules/roles/roles.module';
import { ScreensModule } from './screens/screens.module';
import { SlidesModule } from './modules/slides/slides.module';
import { FilesModule } from './modules/files/files.module';
import { StoragesModule } from './modules/storages/storages.module';
import { MinioModule } from './modules/minio/minio.module';

import typeormConfig from './config/typeorm.config';
import graphqlConfig from './config/graphql.config';

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
    StoragesModule,
    MinioModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
