import { Scalar } from '@nestjs/graphql';
import * as FileType from 'file-type';
import { GraphQLError } from 'graphql';
import { FileUpload } from 'graphql-upload';
import { isUndefined } from 'lodash';

@Scalar('Upload')
export class Upload {
  description = 'File upload scalar type';

  async parseValue(value: Promise<FileUpload>) {
    const upload = await value;
    const stream = upload.createReadStream();
    const fileType = await FileType.fromStream(stream);

    if (isUndefined(fileType)) {
      throw new GraphQLError('Mime type is unknown.');
    }

    if (fileType?.mime !== upload.mimetype) {
      throw new GraphQLError('Mime type does not match file content.');
    }

    return upload;
  }
}
