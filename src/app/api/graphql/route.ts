import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import resolvers from '@/backend/review/resolver/resolvers';
import typeDefs from '@/backend/review/resolver/typeDefs';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server);

export const GET = handler;
export const POST = handler;
