"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const logger = require("morgan");
const path = require("path");
const cors = require("cors");
const favicon = require("serve-favicon");
const errorHandler = require("errorhandler");
const methodOverride = require("method-override");
const graphql_yoga_1 = require("graphql-yoga");
const mongoose = require("mongoose");
mongoose.plugin((schema) => { schema.options.usePushEach = true; });
const index_1 = require("./routes/index");
const api_1 = require("./modules/users/api");
const api_2 = require("./modules/teams/api");
const index_2 = require("./modules/index");
class Server {
    static bootstrap() {
        return new Server();
    }
    constructor() {
        this.app = new graphql_yoga_1.GraphQLServer({
            schema: index_2.Schema,
        });
        this.config();
        this.routes();
        this.api();
    }
    api() {
        const router = express.Router();
        const corsOptions = {
            allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
            credentials: true,
            methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
            origin: "*",
            preflightContinue: false
        };
        router.use(cors(corsOptions));
        router.get("/", (req, res, next) => {
            res.json({ message: "GraphQL Server APIs." });
            next();
        });
        const user = new api_1.UsersApi(router);
        const team = new api_2.TeamsApi(router);
        this.app.use("/api", router);
        router.options("*", cors(corsOptions));
    }
    config() {
        const dbConnection = `mongodb+srv://graphqluser:graphqlpwd@mongo-rhzev.mongodb.net/graphql-db?retryWrites=true&w=majority`;
        mongoose.connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true });
        mongoose.connection.on("error", error => {
            console.error(error);
        });
        this.app.use(logger('":method :url :status :res[content-length] - :response-time ms :referrer :user-agent"'));
        this.app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: "application/json" }));
        this.app.use(bodyParser.urlencoded({
            extended: true
        }));
        this.app.use(function (err, req, res, next) {
            err.status = 404;
            next(err);
        });
        this.app.use(express.static(path.join(__dirname, "public")));
        this.app.express.set("views", path.join(__dirname, "views"));
        this.app.express.engine("html", require("ejs").renderFile);
        this.app.express.set("view engine", "html");
        this.app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));
        this.app.use(cookieParser("GRAPHQL_SECRET"));
        this.app.use(methodOverride());
        global.Promise = require("q").Promise;
        mongoose.Promise = global.Promise;
        this.app.use(errorHandler());
    }
    routes() {
        let router;
        router = express.Router();
        index_1.IndexRoute.create(router);
        this.app.use(router);
    }
}
exports.Server = Server;
