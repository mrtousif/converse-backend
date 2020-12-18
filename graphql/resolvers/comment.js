const CommentCtrl = require("../../comment/comment.controller");
const UserCtrl = require("../../user/user.controller");
const CommentLike = require("../../comment/commentLike.model");
// const { AuthenticationError } = require("apollo-server");

module.exports = {
    Subscription: {},

    Query: {
        getComments: async (_, args, ctx) => {
            try {
                const { postId } = args;
                console.log(postId);
                const user = await UserCtrl.isLoggedIn(ctx);
                let likedComments;
                if (user) {
                    likedComments = await CommentLike.find({
                        postId,
                        userId: user._id,
                    });
                }

                const comments = await CommentCtrl.getAllComments(postId);

                // const updatedComments = [];
                for (let i = 0; i < comments.length; i++) {
                    for (let j = 0; j < likedComments.length; j++) {
                        if (`${comments[i]._id}` === `${likedComments[j].commentId}`) {
                            comments[i] = { ...comments[i]._doc, userLiked: true };
                            break;
                        }
                    }
                }

                return comments;
            } catch (error) {
                throw new Error(error);
            }
        },

        getComment: async (_, args) => {
            try {
                const { commentId } = args;
                const comment = await CommentCtrl.getComment({ commentId });
                return comment;
            } catch (error) {
                throw new Error(error);
            }
        },

        getLikedComments: async (_, args, ctx) => {
            try {
                const { postId } = args;
                // console.log(postId);
                const user = await UserCtrl.protect(ctx);
                // console.log(postId);
                const likedComments = await CommentLike.find({
                    postId,
                    userId: user._id,
                });
                // console.log(likedComments);
                return likedComments;
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Mutation: {
        createComment: async (_, args, context) => {
            try {
                const { body, postId, pageUrl } = args;
                const user = await UserCtrl.protect(context);
                const comment = await CommentCtrl.createComment({
                    body,
                    user,
                    postId,
                    pageUrl,
                });
                context.pubsub.publish("NEW_Comment", {
                    newComment: comment,
                });

                return comment;
            } catch (error) {
                throw new Error(error);
            }
        },

        updateComment: async (_, args, context) => {
            try {
                const { body, commentId } = args;
                const user = await UserCtrl.protect(context);

                const comment = await CommentCtrl.updateComment({
                    commentId,
                    body,
                    user,
                });
                return comment;
            } catch (error) {
                throw new Error(error);
            }
        },

        deleteComment: async (_, args, context) => {
            try {
                const { commentId } = args;
                const user = await UserCtrl.protect(context);

                const comments = await CommentCtrl.deleteComment({ commentId, user });

                return comments;
            } catch (error) {
                throw new Error(error);
            }
        },

        likeComment: async (_, args, context) => {
            try {
                const { commentId, postId } = args;
                const user = await UserCtrl.protect(context);
                const comments = await CommentCtrl.likeComment({
                    commentId,
                    user,
                    postId,
                });
                // console.log(comments);
                return comments;
            } catch (error) {
                throw new Error(error);
            }
        },
    },

    Subscription: {
        newComment: {
            subscribe: (_, __, { pubsub }) => pubsub.asyncIterator("NEW_COMMENT"),
        },
    },
};
