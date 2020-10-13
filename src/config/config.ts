const nodemailer = require("nodemailer");
export class GraphQLConfig {
  config: any = {};

  constructor() {
    this.init();
  }
  init() {
  }

}

export const config = new GraphQLConfig().config;
