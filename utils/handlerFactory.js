const catchAsync = require("./catchAsync.js");
const AppError = require("./AppError.js");
const APIFeatures = require("./APIFeatures.js");

// factory functions
export const createOne = (Model) =>
    catchAsync(async (ctx, next) => {
        const newDoc = await Model.create(req.body);

        res.status(201).json({
            status: "success",
            data: {
                doc: newDoc,
            },
        });
    });

export const getOne = (Model, popOptions) =>
    catchAsync(async (ctx, next) => {
        let Query = Model.findById(req.params.id);
        if (popOptions) Query = Query.populate(popOptions);

        const doc = await Query;
        // Tour.findOne({ _id: req.params.id })
        // const doc = tours.find(el => el.id === id);
        // if doc not found
        if (!doc) {
            return next(new AppError("Invalid ID, No document found", 404));
        }
        res.status(200).json({
            status: "success",
            data: {
                doc,
            },
        });
    });

export const updateOne = (Model) =>
    catchAsync(async (ctx, next) => {
        const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            // update does not run validators by default
            runValidators: true,
        });
        if (!doc) {
            return next(new AppError("Invalid ID. No document found", 404));
        }
        res.status(200).json({
            status: "success",
            data: {
                doc,
            },
        });
    });

export const deleteOne = (Model) =>
    catchAsync(async (ctx, next) => {
        const doc = await Model.findByIdAndDelete(req.params.id);

        if (!doc) {
            return next(new AppError("Invalid ID. No document found", 404));
        }

        res.status(204).json({
            status: "success",
            data: null,
        });
    });

export const getAll = (Model) =>
    catchAsync(async (ctx, next) => {
        // to allow nested GET on tour(hack)
        let filter = {};
        if (req.params.commentId) filter = { commentId: req.params.commentId };
        // building the query
        // const tours = await Tour.find()
        //     .where('duration')
        //     .equals(5)
        //     .where('difficulty')
        //     .equals('easy');

        const features = new APIFeatures(Model.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        // execute query
        const docs = await features.query;
        // const docs = await features.query.explain();

        // send response
        res.status(200).json({
            status: "success",
            results: docs.length,
            data: {
                docs,
            },
        });
    });
