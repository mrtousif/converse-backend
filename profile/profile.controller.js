import Profile from "./profile.model";
// import Website from"../website/website.model");
// import catchAsync from "../utils/catchAsync";
// import AppError from "../utils/AppError";
// const factory from'./handlerFactory');

export const createProfile = async (ctx, next) => {
    const { opinion, pageUrl } = ctx.request.body;
    //check if websiteid exists
    // get the user name
    console.log(ctx.request.body);
    const newProfile = await Profile.create({
        userId: ctx.request.user._id,
        profileName: ctx.request.user.name,
    });

    // update user profile
    // const updateProfile = await Profile

    res.status(201).json({
        status: "success",
        data: newProfile,
    });
};

export const updateProfile = async (ctx, next) => {
    const { commentId } = ctx.request.body;
    const doc = await Profile.findByIdAndUpdate(
        ctx.request.params.profileId,
        profile,
        {
            new: true,
            // update does not run validators by default
            runValidators: true,
        }
    );

    if (!doc) {
        ctx.throw(404, "Invalid ID. No document found");
    }

    res.status(200).json({
        status: "success",
        data: doc,
    });
};

export const deleteProfile = async (ctx, next) => {
    const doc = await Profile.findByIdAndDelete(ctx.request.params.ProfileId);

    if (!doc) {
        ctx.throw(404, "Invalid ID. No document found");
    }

    res.status(204).json({
        status: "success",
        data: null,
    });
};

export const getAllProfiles = async (ctx, next) => {
    // to allow nested GET on tour(hack)
    // let filter = {};
    // if (ctx.request.params.tourId) filter = { tour: ctx.request.params.tourId };
    const { pageUrl } = ctx.request.body;
    // { pageUrl: pageUrl }
    const allProfiles = await Profile.find();

    // building the query
    // const tours = await Tour.find()
    //     .where('duration')
    //     .equals(5)
    //     .where('difficulty')
    //     .equals('easy');

    // const features = new APIFeatures(Profile.find(filter), ctx.request.query)
    //     .filter()
    //     .sort()
    //     .limitFields()
    //     .paginate();

    // execute query
    // const docs = await features.query;
    // const docs = await features.query.explain();

    // send response
    res.status(200).json({
        status: "success",
        results: allProfiles.length,
        data: allProfiles,
    });
};
