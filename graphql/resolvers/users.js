const { UserInputError } = require("apollo-server");
const userCtrl = require("../../user/user.controller");

module.exports = {
    Mutation: {
        signup: async (_, args, ctx, info) => {
            const { name, email, password, confirmPassword } = args;

            const createdUser = await userCtrl.signup({
                name,
                email,
                password,
                confirmPassword,
            });
            return createdUser;
        },

        login: async (_, args) => {
            const { email, password } = args;
            const user = await userCtrl.login({ email, password });

            return user;
        },
    },
};
