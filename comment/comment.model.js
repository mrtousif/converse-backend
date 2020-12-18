const { Schema, model } = require("mongoose");

const commentSchema = new Schema(
    {
        postId: {
            // ref to Post
            type: Schema.Types.ObjectId,
            ref: "Post",
            index: true,
        },
        body: {
            type: String,
            maxlength: 10000,
            trim: true,
        },
        user: {
            // ref to User
            type: Schema.Types.ObjectId,
            ref: "User",
            index: true,
        },
        replies: {
            type: Number,
            default: 0,
        },
        likes: {
            type: Number,
            default: 0,
        },
        pageUrl: String,
        createdAt: String,
        updatedAt: String,
    },
    {
        timestamps: { currentTime: () => new Date().toISOString() },
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// commentSchema.index({ tour: 1, user: 1 }, { unique: true });

// Create a virtual property `fullName` with a getter and setter.
commentSchema
    .virtual("userLiked")
    .get(function () {
        return false;
    })
    .set(function (value, virtual) {
        // console.log(value, virtual, doc);
        // this.userLiked = true;
        // console.log(this);
    });

commentSchema.pre(/^find/, function (next) {
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

// // static method called on the model not document
// commentSchema.statics.calcAvgRatings = async function (tourId) {
//     // calculates average rating and number of ratings of a tour from it's Comments
//     // must be called just after when a Comment is saved to the db
//     // it will be called on the model
//     const stats = await this.aggregate([
//         // select all the Comments belongs to tourId
//         { $match: { tour: tourId } },
//         {
//             $group: {
//                 _id: '$tour',
//                 nRating: { $sum: 1 },
//                 avgRating: { $avg: '$rating' },
//             },
//         },
//     ]);

//     if (stats.length > 0) {
//         // saving the stats of the tour
//         await Tour.findByIdAndUpdate(tourId, {
//             ratingsQuantity: stats[0].nRating,
//             ratingsAverage: stats[0].avgRating,
//         });
//     } else {
//         // no Comment exists
//         await Tour.findByIdAndUpdate(tourId, {
//             ratingsQuantity: 0,
//             ratingsAverage: 4,
//         });
//     }
// };

// // called after new Comment is created
// commentSchema.Comment('save', function () {
//     // this refers to the document is just saved
//     // this.constructor refers to the model from which the document is created -- Comment
//     this.constructor.calcAvgRatings(this.tour);
// });

// // findByIdAndUpdate and findByIdAndDelete have query middleware, not document middleware
// // to call the calcAvgRatings() when a Comment is updated
// commentSchema.pre(/^findOneAnd/, async function (next) {
//     // don't have access to the model Comment here
//     // this refers to the query object
//     this.r = await this.findOne();
//     // console.log(r);
//     next();
// });

// commentSchema.Comment(/^findOneAnd/, async function () {
//     // this.findOne() does not work here because it's already executed
//     // this.r.constructor is the Comment model
//     await this.r.constructor.calcAvgRatings(this.r.tour);
// });

module.exports = model("Comment", commentSchema);
