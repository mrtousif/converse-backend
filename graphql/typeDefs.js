const { gql } = require("apollo-server-express");
// const {} = require("graphql-scalars");
// The GraphQL schema
const typeDefs = gql`
    scalar DateTime
    scalar EmailAddress

    type NewComment {
        _id: ID!
        body: String!
        user: ID!
        replies: Int!
        likes: Int!
        pageUrl: String
        createdAt: DateTime!
    }

    type LikedComment {
        userId: ID!
        commentId: ID!
        # postId: ID
    }

    type Comment {
        _id: ID!
        body: String!
        user: User
        likes: Int!
        replies: Int!
        pageUrl: String
        postId: ID!
        createdAt: DateTime!
        userLiked: Boolean!
    }

    type Reply {
        _id: ID!
        # commentId: ID
        body: String!
        user: User!
        createdAt: DateTime!
        likes: Int!
    }

    type User {
        _id: ID!
        name: String!
        photo: String!
    }

    type Profile {
        user: User!
        comments: [Comment]!
        likedComments: [Comment]!
        likeCount: Int
        commentCount: Int
    }

    type AuthUser {
        _id: ID!
        name: String!
        email: EmailAddress!
        token: String!
        photo: String!
        createdAt: String
    }

    input RegisterInput {
        name: String!
        email: EmailAddress!
        password: String!
        confirmPassword: String!
    }

    type Query {
        getComments(postId: ID!): [Comment]!
        getComment(commentId: ID!): Comment!
        getReplies(commentId: ID!): [Reply]!
        getProfile(userId: ID!): Profile!
        getLikedComments(postId: ID!): [LikedComment]!
    }

    type Mutation {
        signup(
            name: String!
            email: EmailAddress!
            password: String!
            confirmPassword: String!
        ): AuthUser!

        login(email: EmailAddress!, password: String!): AuthUser!

        createComment(postId: ID!, body: String!, pageUrl: String!): Comment!
        deleteComment(commentId: ID!): String
        updateComment(commentId: ID!, body: String): NewComment!
        likeComment(commentId: ID!, postId: ID!): Comment!

        createReply(commentId: ID!, body: String!): Reply!
        deleteReply(replyId: ID!): String
        updateReply(replyId: ID!, body: String!): Reply!
        likeReply(replyId: ID!): Reply
    }

    type Subscription {
        newComment: NewComment!
    }
`;

module.exports = typeDefs;
