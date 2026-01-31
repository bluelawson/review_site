import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar JSON

  type User {
    id: ID!
    name: String!
    email: String!
    plan: String!
    reviewsSubmitted: Int!
    createdAt: String!
  }

  type Review {
    id: ID!
    shopName: String!
    workerName: String!
    estimatedAge: String
    bodyType: String
    bustSize: String
    heightCm: Int
    personality: String
    headline: String!
    detail: String!
    serviceHighlights: [String!]!
    rating: Float!
    reviewRating: Float!
    damage: String
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  input ReviewFilterInput {
    keyword: String
    shopName: String
    workerName: String
    bodyType: String
    personality: String
    bustSize: String
    heightMin: Int
    heightMax: Int
    ratingMin: Float
  }

  input ReviewInput {
    shopName: String!
    workerName: String!
    estimatedAge: String
    bodyType: String
    bustSize: String
    heightCm: Int
    personality: String
    headline: String!
    detail: String!
    serviceHighlights: [String!]
    rating: Float!
    damage: String
    authorEmail: String!
  }

  type Query {
    reviews(filter: ReviewFilterInput): [Review!]!
    review(id: ID!): Review
  }

  type Mutation {
    createReview(input: ReviewInput!): Review!
    deleteReview(id: ID!): Boolean!
  }
`;

export default typeDefs;
