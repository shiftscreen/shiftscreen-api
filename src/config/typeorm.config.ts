import { registerAs } from '@nestjs/config';

import { User } from '../users/users.entity';
import { Role } from '../roles/roles.entity';
import { Screen } from '../screens/screens.entity';
import { Slide } from '../slides/slides.entity';
import { File } from '../files/files.entity';
import { Storage } from '../storages/storages.entity';

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
    Storage,
  ],
  synchronize: true,
}));
