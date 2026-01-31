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
    castName: String!
    estimatedAge: String
    bodyType: String
    bustSize: String
    heightCm: Int
    personality: String
    headline: String!
    detail: String!
    serviceHighlights: [String!]!
    castRating: Float!
    reviewRating: Float!
    isPublished: Boolean!
    damage: String
    createdAt: String!
    updatedAt: String!
    author: User!
  }

  input ReviewFilterInput {
    keyword: String
    shopName: String
    castName: String
    bodyType: String
    personality: String
    bustSize: String
    heightMin: Int
    heightMax: Int
    castRatingMin: Float
  }

  input ReviewInput {
    shopName: String!
    castName: String!
    estimatedAge: String
    bodyType: String
    bustSize: String
    heightCm: Int
    personality: String
    headline: String!
    detail: String!
    serviceHighlights: [String!]
    castRating: Float!
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
    setReviewVisibility(id: ID!, isPublished: Boolean!): Review!
  }
`;

export default typeDefs;
