const commentResolvers = require("./comment");
const userResolvers = require("./users");
const replyResolvers = require("./reply");
const { DateTimeResolver, EmailAddressResolver } = require("graphql-scalars");

// A map of functions which return data for the schema.
module.exports = {
    DateTime: DateTimeResolver,
    EmailAddress: EmailAddressResolver,

    Profile: {
        likeCount: (parent) => {
            console.log(parent);
            return parent.likes.length;
        },

        commentCount: (parent) => parent.comments.length,
    },

    Query: {
        ...commentResolvers.Query,
        ...replyResolvers.Query,
    },

    Mutation: {
        ...userResolvers.Mutation,
        ...commentResolvers.Mutation,
        ...replyResolvers.Mutation,
    },

    Subscription: {
        ...commentResolvers.Subscription,
    },
};
