const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    user: {
        // ref to User
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: [true, "Profile must belong to a user"],
        unique: true,
    },
    Comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    likedComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    likedComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    repliedComments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
});

// instance method - it is available to all documents in a collection
profileSchema.pre(/^findBy/, function (next) {
    this.populate({
        path: "Comments comments likedComments repliedComments",
        select: "",
        // select: '-__v -passwordChangedAt'
    });
    // .populate({
    //     path: "reviews",
    //     select: "",
    // });

    // to measure processing time
    // this.start = Date.now();
    next();
});

// creating model
module.exports = mongoose.model("Profile", profileSchema);
