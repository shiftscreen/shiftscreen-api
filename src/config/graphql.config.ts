import { registerAs } from '@nestjs/config';

export default registerAs('graphql', () => ({
  autoSchemaFile: 'schema.gql',
  context: ({ req, res }) => ({ req, res }),
  installSubscriptionHandlers: true,
}));
