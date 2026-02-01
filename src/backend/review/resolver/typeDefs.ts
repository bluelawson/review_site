import { gql } from 'graphql-tag';

const typeDefs = gql`
  scalar JSON

  enum ReviewStatus {
    PENDING
    APPROVED
    REJECTED
  }

  type User {
    id: ID!
    name: String!
    userName: String!
    email: String!
    plan: String!
    reviewStatusEmailEnabled: Boolean!
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
    likesCount: Int!
    likedByMe: Boolean!
    isPublished: Boolean!
    status: ReviewStatus!
    remandReason: String
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

  input ReviewUpdateInput {
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
    serviceHighlights: [String!]
    castRating: Float!
    damage: String
    authorEmail: String!
  }

  type Query {
    reviews(filter: ReviewFilterInput): [Review!]!
    review(id: ID!, viewerEmail: String): Review
    reviewRequests(viewerEmail: String!): [Review!]!
  }

  type Mutation {
    createReview(input: ReviewInput!): Review!
    updateReview(input: ReviewUpdateInput!): Review!
    deleteReview(id: ID!): Boolean!
    setReviewVisibility(id: ID!, isPublished: Boolean!): Review!
    likeReview(id: ID!, userEmail: String!): Review!
    setReviewStatus(
      id: ID!
      status: ReviewStatus!
      reviewerEmail: String!
      remandReason: String
    ): Review!
    updateReviewStatusEmailPreference(userEmail: String!, enabled: Boolean!): User!
  }
`;

export default typeDefs;
