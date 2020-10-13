"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer = require("nodemailer");
class GraphQLConfig {
    constructor() {
        this.config = {};
        this.init();
    }
    init() {
    }
}
exports.GraphQLConfig = GraphQLConfig;
exports.config = new GraphQLConfig().config;
