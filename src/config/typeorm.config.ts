import { registerAs } from '@nestjs/config';

import { User } from '../modules/users/users.entity';
import { Role } from '../modules/roles/roles.entity';
import { Screen } from '../modules/screens/screens.entity';
import { Slide } from '../modules/slides/slides.entity';
import { File } from '../modules/files/files.entity';
import { FileKey } from '../modules/files-keys/files-keys.entity';
import { Storage } from '../modules/storages/storages.entity';
import { AppInstance } from '../modules/apps-instances/apps-instances.entity';
import { Organization } from '../modules/organizations/organizations.entity';
import { Token } from '../modules/auth/entities/token.entity';
import { ScreenKey } from '../modules/screens-keys/screens-keys.entity';

export default registerAs('typeorm', () => ({
  type: process.env.DATABASE_TYPE,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 3306,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  entities: [
    User,
    Role,
    Screen,
    Slide,
    File,
    FileKey,
    Storage,
    AppInstance,
    Organization,
    Token,
    ScreenKey,
  ],
  synchronize: true,
  logging: process.env.NODE_ENV !== 'production'
}));
