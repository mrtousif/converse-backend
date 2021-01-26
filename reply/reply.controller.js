const Reply = require("./reply.model");
const Profile = require("../profile/profile.model");
const Comment = require("../comment/comment.model");
const ReplyLike = require("./replyLike.model");
// const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/AppError");
// const APIFeatures = require("../utils/APIFeatures");
// const factory = require('./handlerFactory');

const { AuthenticationError, UserInputError } = require("apollo-server-express");

exports.createReply = async ({ commentId, body, user }) => {
    //check if websiteid exists
    // get the user name
    const newReply = await Reply.create({
        body,
        commentId,
        user: user._id,
    });

    await newReply
        .populate({
            path: "user",
            select: "name photo",
        })
        .execPopulate();

    // update user profile
    await Profile.findOneAndUpdate(
        { user: user._id },
        {
            $push: { replies: newReply._id },
        }
    );

    await Comment.findByIdAndUpdate(commentId, { $inc: { replies: 1 } });

    // const updateProfile = await Profile.

    return newReply;
};

exports.getReply = async ({ replyId }) => {
    const reply = await Reply.findById(replyId);
    if (!reply) {
        throw new UserInputError("Invalid ID. Reply not found");
    }
    return reply;
};

exports.likeReply = async ({ replyId, user }) => {
    // let likedReply;
    // liked = true;
    // get user profile
    const likedReply = await ReplyLike.findOne({
        userId: user._id,
        replyId: replyId,
    });
    // const profile = await Profile.findOne({ userId: user._id });

    // get Reply
    const reply = await this.getReply({ replyId });
    // check if Reply is already liked
    // likedReply = profile.likedReplys.filter((Reply) => `${Reply}` === `${replyId}`);

    let updatedReply;
    // Reply is not liked
    if (!likedReply) {
        // profile.likedReplys.push(replyId);
        await ReplyLike.create({ userId: user._id, replyId: replyId });

        reply.likes = reply.likes + 1;
        updatedReply = await reply.save();
        // await profile.save();
    } else {
        // Reply is already liked
        await ReplyLike.deleteOne({ userId: user._id, replyId: replyId });

        reply.likes = reply.likes - 1;
        updatedReply = await reply.save();

        // const index = profile.likedReplys.indexOf(replyId);
        // if (index > -1) {
        //     profile.likedReplys.splice(index, 1);
        // }
        // // updatedProfile = profile.likedReplys.filter((item) => item !== value);

        // await profile.save();
    }
    return updatedReply;
};

// exports.likeReply = async ({ replyId, user }) => {
//     let likedComment;
//     // get user profile
//     const profile = await Profile.findOne({ user: user._id });
//     // get reply
//     const reply = await this.getReply({ replyId });
//     // check if post is already liked
//     console.log(reply);
//     likedPost = profile.likedComments.filter((reply) => `${reply}` === `${replyId}`);
//     let updatedComment;
//     // post is not liked
//     if (likedPost.length === 0) {
//         reply.likes = reply.likes + 1;
//         updatedComment = await reply.save();

//         profile.likedComments.push(replyId);

//         await profile.save();
//     } else {
//         // post is already liked
//         comment.likes = comment.likes - 1;
//         updatedComment = await comment.save();

//         const index = profile.likedComments.indexOf(replyId);
//         if (index > -1) {
//             profile.likedComments.splice(index, 1);
//         }
//         // updatedProfile = profile.likedPosts.filter((item) => item !== value);

//         await profile.save();
//     }
//     return updatedComment;
// };

exports.updateReply = async ({ replyId, body, user }) => {
    const comment = await Reply.findById(replyId);
    let updatedComment;
    if (comment && `${comment.user._id}` === `${user._id}`) {
        comment.body = body;
        updatedComment = await comment.save({
            validateBeforeSave: true,
        });
    } else if (!comment) {
        throw new UserInputError("Invalid ID. No document found");
    } else {
        throw new AuthenticationError("Action not allowed");
    }

    return updatedComment;
};

exports.deleteReply = async ({ replyId, user }) => {
    const doc = await Reply.findById(replyId);

    if (!doc) {
        throw new UserInputError("Invalid ID. No document found");
    }

    if (`${doc.user._id}` === `${user._id}`) {
        await Reply.findByIdAndDelete(replyId);
        await Profile.findOneAndUpdate(
            { user: user._id },
            {
                $pull: { replies: replyId },
            }
        );
        console.log(doc);
        await Comment.findByIdAndUpdate(doc.commentId, { $inc: { replies: -1 } });
    } else {
        throw new AuthenticationError("Action not allowed");
    }

    return null;
};

exports.getAllReplies = async ({ commentId }) => {
    // to allow nested GET on tour(hack)
    // let filter = {};
    // if (commentId) filter = { commentId: commentId };

    // TODO: Add a feature that sort by user replies if there's any
    // let token;
    // if (req.cookies.jwt) token = req.cookies.jwt;

    // building the query
    // const tours = await Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy');
    // let query = {};

    // const features = new APIFeatures(Reply.find(filter), query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();

    // // execute query
    // const docs = await features.query;
    // const docs = await features.query.explain();
    // docs.map((comment) => {
    //     const photo = comment.userPhoto;
    //     comment.userPhoto = `https://f000.backblazeb2.com/file/user-profile-pics/${photo}`;
    // });
    const docs = await Reply.find({ commentId });

    // send response
    return docs;
};
