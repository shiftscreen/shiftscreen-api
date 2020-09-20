import { registerAs } from '@nestjs/config';

export default registerAs('mail', () => ({
  transport: process.env.MAIL_TRANSPORT,
}));
