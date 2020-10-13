import * as bodyParser from "body-parser";
import * as cookieParser from "cookie-parser";
import * as express from "express";
import * as logger from "morgan";
import * as path from "path";
import * as cors from "cors";
import favicon = require("serve-favicon");
import errorHandler = require("errorhandler");
import methodOverride = require("method-override");
import { GraphQLServer } from "graphql-yoga";
import mongoose = require("mongoose");
mongoose.plugin((schema: any) => { schema.options.usePushEach = true; });

// Index Routes
import { IndexRoute } from "./routes/index";

// APIs
import { UsersApi } from "./modules/users/api";
import { TeamsApi } from "./modules/teams/api";
import { Schema } from "./modules/index";

/**
 * The server.
 *
 * @class Server
 */
export class Server {

  /**
   * The express application.
   * @type {Application}
   */
  public app: any;
  /**
   * Bootstrap the application.
   *
   * @class Server
   * @method bootstrap
   * @static
   */
  public static bootstrap(): Server {
    return new Server();
  }

  /**
   * Constructor.
   *
   * @class Server
   * @constructor
   */
  constructor() {
    // create expressjs application
    this.app = new GraphQLServer({
      schema: Schema,
    });
    // configure application
    this.config();

    // add routes
    this.routes();

    // add api
    this.api();

  }

  /**
   * Create REST API routes
   *
   * @class Server
   * @method api
   */
  public api() {

    const router = express.Router();
    // configure CORS
    const corsOptions: cors.CorsOptions = {
      allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "X-Access-Token"],
      credentials: true,
      methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
      origin: "*",
      preflightContinue: false
    };
    router.use(cors(corsOptions));

    // root request
    router.get("/", (req: express.Request, res: express.Response, next: express.NextFunction) => {
      res.json({ message: "GraphQL Server APIs." });
      next();
    });

    // create API routes
    const user = new UsersApi(router);
    const team = new TeamsApi(router);

    // wire up the REST API
    this.app.use("/api", router);

    // enable CORS pre-flight
    router.options("*", cors(corsOptions));
  }

  /**
   * Configure application
   *
   * @class Server
   * @method config
   */
  public config() {
    // connect to mongoose
    const dbConnection = `mongodb+srv://graphqluser:graphqlpwd@mongo-rhzev.mongodb.net/graphql-db?retryWrites=true&w=majority`;
    // const dbConnection = `mongodb://localhost:27017/graphql-db`;

    mongoose.connect(dbConnection, { useNewUrlParser: true, useCreateIndex: true });
    mongoose.connection.on("error", error => {
      console.error(error);
    });

    // morgan middleware to log HTTP requests
    this.app.use(logger('":method :url :status :res[content-length] - :response-time ms :referrer :user-agent"'));

    // use json form parser middleware
    this.app.use(bodyParser.json({ limit: 1024 * 1024 * 20, type: "application/json" }));

    // use query string parser middleware
    this.app.use(bodyParser.urlencoded({
      extended: true
    }));

    //  catch 404 and forward to error handler
    this.app.use(function (err: any, req: express.Request, res: express.Response, next: express.NextFunction) {
      err.status = 404;
      next(err);
    });

    // Add static paths
    this.app.use(express.static(path.join(__dirname, "public")));

    // Configure view
    this.app.express.set("views", path.join(__dirname, "views"));
    this.app.express.engine("html", require("ejs").renderFile);
    this.app.express.set("view engine", "html");
    this.app.use(favicon(path.join(__dirname, "public", "images", "favicon.png")));

    // Mount cookie parker
    this.app.use(cookieParser("GRAPHQL_SECRET"));

    // Mount override
    this.app.use(methodOverride());

    // Use q promises
    global.Promise = require("q").Promise;
    mongoose.Promise = global.Promise;

    // Error handling
    this.app.use(errorHandler());
  }

  /**
   * Create and return Router.
   *
   * @class Server
   * @method config
   * @return void
   */
  private routes() {
    let router: express.Router;
    router = express.Router();

    // IndexRoute
    IndexRoute.create(router);

    // Use router middleware
    this.app.use(router);
  }
}
