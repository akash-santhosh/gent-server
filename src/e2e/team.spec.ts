// // mocha
// import "mocha";
// import { suite, test } from "mocha-typescript";

// // mongoose
// import { Connection, connect, model, Model, Document, Schema, disconnect } from "mongoose";

// // model
// import { ITeam as Team, ITeamSLA } from "../modules/teams/interface";
// import { TeamSchema, ITeamModel, ITeamModelStatic } from "../modules/teams/schema";

// // test server config
// import { TestServer } from "./config";

// // test mocks
// import { TestMock } from "./mocks";

// // Import Config
// import { config } from "../config/config";

// // require chai and use should assertions
// const chai = require("chai");
// chai.should();

// // configure chai-http
// chai.use(require("chai-http"));

// @suite export class TeamsTest {

//   // constants
//   public static BASE_URI = "/api/teams";

//   // the mongooose connection
//   public static connection: Connection;

//   // the Team model
//   public static Team: ITeamModelStatic;

//   // team document
//   public static team: ITeamModel;

//   public static server = TestServer;

//   /**
//    * Before all hook.
//    */
//   public static before() {
//     // connect to MongoDB
//     const environment = process.env.NODE_ENV;
//     const environmentPaths = config.paths.filter((object: any) => {
//       return object.name === environment;
//     });
//     if (environment === "local") {
//       const dbConnection = `mongodb://` + environmentPaths[0].db.path + `:27017/one-portal`;
//       connect(dbConnection, { useMongoClient: true });
//     } else if (environment === "dev" || environment === "stage" || environment === "production" || environment === "qa") {
//       const dbConnection = `mongodb://` + environmentPaths[0].db.user + `:` + environmentPaths[0].db.pass + `@` + environmentPaths[0].db.path + `:27017/one-portal`;
//       connect(dbConnection, { useMongoClient: true });
//     }
//     TeamsTest.Team = model<ITeamModel, ITeamModelStatic>("Team", TeamSchema);
//   }

//   /**
//    * After all hook
//    */
//   public static after() {
//     return disconnect();
//   }

//   // specs

//   @test("should create a team")
//   public post() {
//     const data: Team = TestMock.team;

//     return chai.request(TeamsTest.server).post(TeamsTest.BASE_URI)
//       .send(data)
//       .then(response => {
//         response.should.have.status(200);
//         response.body.should.be.a("object");
//         response.body.should.have.a.property("_id");
//         response.body.should.have.property("name").eql(data.name);
//         response.body.should.have.property("description").eql(data.description);
//         response.body.should.have.property("mailingList").eql(data.mailingList);
//         response.body.should.have.property("manager").eql(data.manager);
//         response.body.should.have.property("ownership").which.is.an("array");
//         response.body.ownership[0].should.have.property("kerberosID").eql(data.ownership[0].kerberosID);
//         response.body.ownership[0].should.have.property("name").eql(data.ownership[0].name);
//         response.body.ownership[0].should.have.property("email").eql(data.ownership[0].email);
//         response.body.ownership[0].should.have.property("primary").eql(data.ownership[0].primary);
//         response.body.should.have.property("sla").which.is.an("array");
//         response.body.sla[0].should.have.property("severity").eql(data.sla[0].severity);
//         response.body.sla[0].should.have.property("level").which.is.an("array");
//         return TeamsTest.team = response.body;
//       });
//   }

//   @test("should list the teams")
//   public list() {
//     return chai.request(TeamsTest.server).get(TeamsTest.BASE_URI).then(response => {
//       response.should.have.status(200);
//       response.body.should.be.an("array");
//       response.body.should.have.length.above(0);
//     });
//   }

//   @test("should get a teams by id")
//   public get() {
//     return chai.request(TeamsTest.server).get(`${TeamsTest.BASE_URI}/${TeamsTest.team._id}`).then(response => {
//       response.should.have.status(200);
//       response.body.should.be.a("object");
//       response.body.details.should.have.property("name").eql(TeamsTest.team.name);
//       response.body.details.should.have.property("description").eql(TeamsTest.team.description);
//       response.body.details.should.have.property("mailingList").eql(TeamsTest.team.mailingList);
//       response.body.details.should.have.property("manager").eql(TeamsTest.team.manager);
//       response.body.details.should.have.property("ownership").which.is.an("array");
//       response.body.details.ownership[0].should.have.property("kerberosID").eql(TeamsTest.team.ownership[0].kerberosID);
//       response.body.details.ownership[0].should.have.property("name").eql(TeamsTest.team.ownership[0].name);
//       response.body.details.ownership[0].should.have.property("email").eql(TeamsTest.team.ownership[0].email);
//       response.body.details.ownership[0].should.have.property("primary").eql(TeamsTest.team.ownership[0].primary);
//       response.body.details.should.have.property("sla").which.is.an("array");
//       response.body.details.sla[0].should.have.property("severity").eql(TeamsTest.team.sla[0].severity);
//       response.body.details.sla[0].should.have.property("level").which.is.an("array");
//     });
//   }

//   @test("update a team")
//   public put() {
//     const data: Team = TeamsTest.team;
//     return chai.request(TeamsTest.server).put(`${TeamsTest.BASE_URI}/${TeamsTest.team._id}`)
//       .send(data)
//       .then(response => {
//         response.should.have.status(200);
//         response.body.should.be.a("object");
//         response.body.should.have.a.property("_id");
//         response.body.should.have.property("name").eql(data.name);
//         response.body.should.have.property("description").eql(data.description);
//         response.body.should.have.property("mailingList").eql(data.mailingList);
//         response.body.should.have.property("manager").eql(data.manager);
//         response.body.should.have.property("ownership").which.is.an("array");
//         response.body.ownership[0].should.have.property("kerberosID").eql(data.ownership[0].kerberosID);
//         response.body.ownership[0].should.have.property("name").eql(data.ownership[0].name);
//         response.body.ownership[0].should.have.property("email").eql(data.ownership[0].email);
//         response.body.ownership[0].should.have.property("primary").eql(data.ownership[0].primary);
//         response.body.should.have.property("sla").which.is.an("array");
//         response.body.sla[0].should.have.property("severity").eql(data.sla[0].severity);
//         response.body.sla[0].should.have.property("level").which.is.an("array");
//       });
//   }

//   @test("should delete a team")
//   public delete() {
//     return chai.request(TeamsTest.server).del(`${TeamsTest.BASE_URI}/${TeamsTest.team._id}`).then(response => {
//       response.should.have.status(200);
//     });
//   }
// }
