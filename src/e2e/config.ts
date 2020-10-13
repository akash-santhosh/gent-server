// server
import { Server } from "../server";

// require http server
const http = require("http");

export class TestConnections {

  // the http server
  server: any;
  app: any;

  constructor() {
    this.init();
  }

  /**
   * Before all hook.
   */
  init() {
    console.log("initialized the test server");
    // create http server
    const port = 8001;
    const options = {
      port: 8001,
      endpoint: "/graphql",
      subscriptions: "/subscriptions",
      tracing: true,
    };

    process.env.NODE_ENV = "test";
    const app = Server.bootstrap().app;
    try {
      this.server = app.start(options);
    } catch (err) {
      throw err;
    }
  }
}

const TestConn = new TestConnections();
export const TestServer = TestConn.server;
export const Auth = { "Authorization": "Basic c2ZhZnN0ZXN0OnRlc3R2amFodmNqa2F2Y2Q=" };
