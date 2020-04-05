import { FileUpload } from 'graphql-upload';
import { join } from 'lodash';

import { User } from '../../modules/users/users.entity';

export const createUniqueFilename = (file: FileUpload): string => {
  const timestamp = new Date().getTime();
  const encodedFileName = encodeURI(file.filename);
  return join([timestamp, encodedFileName], '-');
};

export const getUserFilePath = (user: User, filename: string): string => {
  return join(['users', user.id, filename], '/');
};
