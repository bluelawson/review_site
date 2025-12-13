import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.graphql': {
        loaders: ['graphql-tag/loader'],
        as: '*.js',
      },
      '*.gql': {
        loaders: ['graphql-tag/loader'],
        as: '*.js',
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      use: [{ loader: 'graphql-tag/loader' }],
    });
    return config;
  },
};

export default nextConfig;
