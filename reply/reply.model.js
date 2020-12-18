const mongoose = require("mongoose");

const replySchema = new mongoose.Schema(
    {
        commentId: {
            // ref to page -- parent referencing
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
            required: [true, "Comment must belong to a webpage"],
        },
        user: {
            // ref to User
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Comment must belong to a user"],
            // select: false,
        },
        replyId: {
            // ref to Reply if it is reply of a reply
            type: mongoose.Schema.Types.ObjectId,
            ref: "Reply",
        },
        body: {
            type: String,
            maxlength: 10000,
            required: true,
            trim: true,
        },
        likes: {
            type: Number,
            min: 0,
            default: 0,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

replySchema.pre(/^find/, function (next) {
    // this.populate({
    //     path: 'tour',
    //     select: 'name'
    // }).populate({
    //     path: 'user',
    //     select: 'name photo'
    // });
    this.populate({
        path: "user",
        select: "name photo",
    });
    next();
});

const Reply = mongoose.model("Reply", replySchema);

module.exports = Reply;
