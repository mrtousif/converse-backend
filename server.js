const mongoose = require("mongoose");
const dotenv = require("dotenv");
const { ApolloServer, PubSub } = require("apollo-server");
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

server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
});
