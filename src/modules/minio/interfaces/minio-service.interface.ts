import { FileUpload } from 'graphql-upload';

export interface IMinioService {
  expiryTime: number;

  uploadFileToFilePath(file: FileUpload, filePath: string): Promise<string>;
  getPresignedUrl(filePath: string): Promise<string>;
}
