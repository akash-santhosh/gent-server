"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = require("../server");
const http = require("http");
class TestConnections {
    constructor() {
        this.init();
    }
    init() {
        console.log("initialized the test server");
        const port = 8001;
        const options = {
            port: 8001,
            endpoint: "/graphql",
            subscriptions: "/subscriptions",
            tracing: true,
        };
        process.env.NODE_ENV = "test";
        const app = server_1.Server.bootstrap().app;
        try {
            this.server = app.start(options);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.TestConnections = TestConnections;
const TestConn = new TestConnections();
exports.TestServer = TestConn.server;
exports.Auth = { "Authorization": "Basic c2ZhZnN0ZXN0OnRlc3R2amFodmNqa2F2Y2Q=" };
