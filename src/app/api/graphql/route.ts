import { ApolloServer } from '@apollo/server';
import { startServerAndCreateNextHandler } from '@as-integrations/next';

import resolvers from '@/graphql/resolvers';
import typeDefs from '@/graphql/typeDefs';
import prisma from '@/lib/prisma';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const handler = startServerAndCreateNextHandler(server, {
  context: async () => ({ prisma }),
});

export const GET = handler;
export const POST = handler;
