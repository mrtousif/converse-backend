const mongoose = require("mongoose");
const dotenv = require("dotenv");
const express = require("express");
const { ApolloServer, PubSub } = require("apollo-server-express");
const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const pino = require("express-pino-logger")();

const app = express();
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

let DB = "";
if (process.env.NODE_ENV === "production") {
    DB = process.env.DATABASE.replace("<PASSWORD>", process.env.DB_PASSWORD);
} else {
    DB = process.env.LOCAL_DB;
}

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

server.applyMiddleware({ app });

const PORT = process.env.PORT || 4000;

app.listen({ port: PORT }, () => {
    console.log(`🚀 Server ready at http://localhost:${PORT}${server.graphqlPath}`);
});
// app.listen({ port: 5000 }, () =>
//     console.log(`🚀 Server ready at http://localhost:5000${server.graphqlPath}`)
// );
