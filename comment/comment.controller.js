const Comment = require("./comment.model");
const CommentLike = require("./commentLike.model");
const Profile = require("../profile/profile.model");
// const Website = require("../website/website.model");
const { ValidationError, UserInputError, AuthenticationError } = require("apollo-server");

// const APIFeatures = require("../utils/APIFeatures");
// const factory = require('./handlerFactory');

exports.createComment = async ({ body, user, postId, pageUrl }) => {
    // const { opinion, pageUrl } = req.body;
    //check if websiteid exists
    // get the user name
    const newComment = await Comment.create({
        body,
        user: user._id,
        postId,
        pageUrl,
    });

    await newComment
        .populate({
            path: "user",
            select: "name photo",
        })
        .execPopulate();

    // update user profile
    await Profile.findOneAndUpdate(
        { userId: user._id },
        {
            $push: { comments: newComment._id },
        }
    );

    // const updateProfile = await Profile.

    return newComment;
};

exports.likeComment = async ({ commentId, user, postId }) => {
    // let likedComment;
    // liked = true;
    // get user profile
    const likedComment = await CommentLike.findOne({
        userId: user._id,
        commentId,
    });
    // const profile = await Profile.findOne({ userId: user._id });

    // get Comment
    const comment = await this.getComment({ commentId });
    // check if Comment is already liked
    // likedComment = profile.likedComments.filter((Comment) => `${Comment}` === `${commentId}`);

    let updatedComment;
    // Comment is not liked
    if (!likedComment) {
        // profile.likedComments.push(commentId);
        await CommentLike.create({ userId: user._id, commentId, postId });

        comment.likes = comment.likes + 1;
        updatedComment = await comment.save();
        // await profile.save();
    } else {
        // Comment is already liked
        await CommentLike.deleteOne({ userId: user._id, commentId: commentId });

        comment.likes = comment.likes - 1;
        updatedComment = await comment.save();

        // const index = profile.likedComments.indexOf(commentId);
        // if (index > -1) {
        //     profile.likedComments.splice(index, 1);
        // }
        // // updatedProfile = profile.likedComments.filter((item) => item !== value);

        // await profile.save();
    }
    return updatedComment;
};

exports.updateComment = async ({ commentId, body, user }) => {
    const comment = await Comment.findById(commentId);
    let updatedComment;
    if (comment && `${comment.user._id}` === `${user._id}`) {
        comment.body = body;
        updatedComment = await comment.save({
            validateBeforeSave: true,
        });
        // updatedComment = await Comment.findByIdAndUpdate(commentId, body, {
        //     new: true,
        //     // update does not run validators by default
        //     runValidators: true,
        // });
    } else if (!comment) {
        throw new UserInputError("Invalid ID. No document found");
    } else {
        throw new AuthenticationError("Action not allowed");
    }

    return updatedComment;
};

exports.deleteComment = async ({ commentId, user }) => {
    const doc = await Comment.findById(commentId);
    if (!doc) {
        throw new UserInputError("Invalid ID. No document found", 404);
    }

    if (`${doc.user._id}` === `${user._id}`) {
        await Comment.findByIdAndDelete(commentId);
        await CommentLike.deleteMany({ commentId: commentId });
        await Profile.findOneAndUpdate(
            { userId: user._id },
            {
                $pull: { Comments: commentId },
            }
        );
    } else {
        throw new UserInputError("Action not allowed");
    }

    return null;
};

exports.getComment = async ({ commentId }) => {
    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new UserInputError("Invalid ID. Comment not found");
    }

    return comment;
};

exports.getAllComments = async (postId) => {
    // to allow nested GET on tour(hack)
    // const { req } = ctx;
    // let filter = {};
    // if (req.params.pageUrl) filter = { pageUrl: req.params.pageUrl };

    // TODO: Add a feature that sort by user Comments if there's any
    // let token;
    // if (req.cookies.jwt) token = req.cookies.jwt;

    // building the query
    // const tours = await Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy');

    // const features = new APIFeatures(Comment.find(filter), req.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();

    // execute query
    // const docs = await features.query;
    // const docs = await features.query.explain();
    // docs.map((Comment) => {
    //     const photo = Comment.userPhoto;
    //     Comment.userPhoto = `https://f000.backblazeb2.com/file/user-profile-pics/${photo}`;
    // });

    const docs = await Comment.find({ postId: postId });

    // send response
    return docs;
};
