import { registerAs } from '@nestjs/config';
import { ClientOptions } from 'minio';

export default registerAs('minio', (): ClientOptions => ({
  endPoint: process.env.MINIO_END_POINT,
  accessKey: process.env.MINIO_ACCESS_KEY,
  secretKey: process.env.MINIO_SECRET_KEY,
  useSSL: process.env.MINIO_USE_SSL === 'true',
  port: parseInt(process.env.MINIO_PORT, 10),
}));
