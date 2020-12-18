// catch async errors
const catchAsync = (func) => {
    return (ctx, next) => {
        func(ctx, next).catch(next); // err => next(err)
        // if there is error. err object is sent straight to the global errorController
    };
};

export default catchAsync;
