const mongoose from"mongoose");

// schema
const websiteSchema = new mongoose.Schema(
    {
        // schema definitions
        pageUrl: {
            name: String,
            required: [true, "Webpage URL is required"],
            trim: true,
        },
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: [true, "Website must have a admin"],
        },
        category: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// bookingSchema.pre(/^find/, function(next) {
//     this.populate({
//         path: 'tour',
//         select: 'name'
//     }).populate('user');

//     next();
// });

export default mongoose.model("Website", websiteSchema);
