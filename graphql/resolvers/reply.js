const userCtrl = require("../../user/user.controller");
const commentCtrl = require("../../comment/comment.controller");
const replyCtrl = require("../../reply/reply.controller");
const { UserInputError, AuthenticationError } = require("apollo-server");

module.exports = {
    Query: {
        getReplies: async (_, args, ctx) => {
            try {
                const { commentId } = args;
                const replies = await replyCtrl.getAllReplies({ commentId });

                return replies;
            } catch (error) {
                throw new Error(error);
            }
        },

        // getComment: async (_, args) => {
        //     try {
        //         const { commentId } = args;
        //         const comment = await commentCtrl.getComment({ commentId });
        //         return comment;
        //     } catch (error) {
        //         throw new Error(error);
        //     }
        // },
    },
    Mutation: {
        createReply: async (_, args, context) => {
            try {
                const user = await userCtrl.protect(context);
                const { body, commentId } = args;
                if (body.length < 1) {
                    throw new UserInputError("'body' must not be empty", {
                        errors: {
                            body: "Reply body must not be empty",
                        },
                    });
                }
                const comment = await commentCtrl.getComment({ commentId });
                if (comment) {
                    const reply = await replyCtrl.createReply({
                        commentId,
                        body,
                        user,
                    });
                    return reply;
                } else {
                    throw new UserInputError("Invalid ID. Reply not found");
                }
            } catch (error) {
                throw new Error(error);
            }
        },

        updateReply: async (_, args, context) => {
            try {
                const user = await userCtrl.protect(context);
                const { body, replyId } = args;
                if (body.length < 1) {
                    throw new UserInputError("'body' must not be empty", {
                        errors: {
                            body: "Reply body must not be empty",
                        },
                    });
                }

                const reply = await replyCtrl.createReply({
                    replyId,
                    body,
                    user,
                });
                return reply;
            } catch (error) {
                return new Error(error);
            }
        },

        deleteReply: async (_, args, context) => {
            try {
                const user = await userCtrl.protect(context);
                const { replyId } = args;
                const comment = await replyCtrl.deleteReply({
                    replyId,
                    user,
                });

                return comment;
            } catch (error) {
                throw new Error(error);
            }
        },

        likeReply: async (_, args, context) => {
            try {
                const user = await userCtrl.protect(context);
                const { replyId } = args;
                // console.log(replyId);
                const comment = await replyCtrl.likeReply({
                    replyId,
                    user,
                });

                return comment;
            } catch (error) {
                throw new Error(error);
            }
        },
    },
};
