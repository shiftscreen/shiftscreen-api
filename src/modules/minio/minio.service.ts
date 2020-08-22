import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { FileUpload } from 'graphql-upload';
import * as Minio from 'minio';

import { IMinioService } from './interfaces/minio-service.interface'

@Injectable()
export class MinioService implements IMinioService {
  public readonly expiryTime = 60 * 15; // 15 MINUTES
  private minioClient: Minio.Client;
  private readonly bucketName = process.env.NODE_ENV === 'production'
    ? 'shiftscreen'
    : 'shiftscreen-test';

  constructor(
    private readonly configService: ConfigService,
  ) {
    this.minioClient = new Minio.Client(configService.get('minio'));
    this.initBucket();
  }

  private async initBucket(): Promise<void> {
    const exists = await this.minioClient.bucketExists(this.bucketName);
    if (!exists) {
      await this.minioClient.makeBucket(this.bucketName, '');
    }
  }

  public async uploadFileToFilePath(file: FileUpload, filePath: string): Promise<string> {
    const fileStream = file.createReadStream();
    const metaData = {
      'Content-Type': file.mimetype,
    };

    return this.minioClient.putObject(
      this.bucketName,
      filePath,
      fileStream,
      metaData,
    )
  }

  public async deleteFileFromFilePath(filePath: string): Promise<void> {
    return this.minioClient.removeObject(
      this.bucketName,
      filePath,
    )
  }

  public async getPresignedUrl(filePath: string): Promise<string> {
    return this.minioClient.presignedGetObject(
      this.bucketName,
      filePath,
      this.expiryTime
    )
  }
}
