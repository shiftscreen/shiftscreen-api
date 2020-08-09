import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { User } from './users.entity';

import { StoragesModule } from '../storages/storages.module';
import { StoragesService } from '../storages/storages.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    forwardRef(() => AuthModule),
    forwardRef(() => StoragesModule),
    TypeOrmModule.forFeature([User])
  ],
  providers: [
    UsersService,
    UsersResolver,
    StoragesService,
  ],
  exports: [UsersService, TypeOrmModule],
})
export class UsersModule {}
