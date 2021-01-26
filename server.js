const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const pino = require("express-pino-logger")();
const cors = require("cors");

const app = express();

// let origin = "http://localhost:3000";
// if (process.env.NODE_ENV === "production") {
//     origin = /vercel\.app$/;
// } else {
//     origin = "http://localhost:3000";
// }

// app.use(
//     cors({
//         origin: origin,
//         credentials: true,
//     })
// );
// app.use(express.json());
app.use(pino);

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception");
    console.error(err);
    console.error("Shutting Down the server...");
    // kill
    process.exit(1);
});

dotenv.config();

const pubsub = new PubSub();

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
});

server.applyMiddleware({ app, path: "/" });

let DB = "";
if (process.env.NODE_ENV === "production") {
    DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);
} else {
    DB = process.env.LOCAL_DB;
}

const PORT = process.env.PORT || 4000;

// app.all("/*", (req, res, next) => {
//     // const err = new Error(`${req.url} does not exist`);
//     // err.statusCode = 404;
//     // err.status = 'fail';
//     res.status(404).json({
//         status: "fail",
//         message: `${req.url} does not exist. Use /graphql to access the graphql api`,
//     });
// });

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        console.log("Database Connected");
        app.listen({ port: PORT }, () => {
            console.log(
                `🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`
            );
        });
    })
    .catch((err) => console.error("Database Connection Failure"));
// app.listen({ port: 5000 }, () =>
//     console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
// );

process.on("unhandledRejection", (err) => {
    console.log("Unhandled Rejection");
    console.error(err);
    console.log("Shutting Down the server...");
    // safely close
    db.close();
    server.close(() => {
        // kill
        process.exit(1);
    });
});
