// const Koa = require("koa");
// const { ApolloServer, PubSub } = require("apollo-server-koa");
const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const { ApolloServer, PubSub } = require("apollo-server");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");

process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception");
    console.error(err);
    console.error("Shutting Down the server...");
    // kill
    process.exit(1);
});

dotenv.config();

const pubsub = new PubSub();
// const DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);

const DB = process.env.LOCAL_DB;

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
    })
    .then((con) => {
        console.log("Database Connected");
    })
    .catch((err) => console.error("Database Connection Failure"));

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({ req, pubsub }),
});

// const app = new Koa();
const app = express();
server.applyMiddleware({ app });
// alternatively you can get a composed middleware from the apollo server
// app.use(server.getMiddleware());

app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
);
