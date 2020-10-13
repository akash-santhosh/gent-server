"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai = require("chai");
const supertest = require("supertest");
const mocks_1 = require("./mocks");
const config_1 = require("./config");
let request;
const expect = chai.expect;
before((done) => {
    config_1.TestServer.then((server) => {
        request = supertest(server);
        done();
    });
});
describe("Users Test", () => {
    const query = `
        fragment userType on UserType {
            _id
            kerberosID
            name
            email
            location
            title
            teams {
                name
                access
                primary
            }
        }
        query ListingUsers($uid: String!) {
            listUsers {
                ...userType
            }

            getUser(uid: $uid) {
                ...userType
            }
        }

        mutation AddingUser($input: UserInput) {
            addUser(input: $input) {
                ...userType
            }
        }

        mutation UpdatingUser($input: UserInput) {
            updateUser(input: $input) {
                ...userType
            }
        }

        mutation DeletingUser($_id: String!) {
            deleteUser(_id: $_id) {
                ...userType
            }
        }
    `;
    it("should create a new User", (done) => {
        request
            .post("/graphql")
            .set(config_1.Auth)
            .send({
            query,
            operationName: "AddingUser",
            variables: {
                input: mocks_1.TestMock.user
            }
        })
            .expect((res) => {
            expect(res.body).to.not.have.property("errors");
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.have.property("addUser");
            expect(res.body.data.addUser).to.be.an("object");
            expect(res.body.data.addUser).to.have.property("_id", mocks_1.TestMock.user._id);
            expect(res.body.data.addUser).to.have.property("kerberosID", mocks_1.TestMock.user.kerberosID);
            expect(res.body.data.addUser).to.have.property("name", mocks_1.TestMock.user.name);
            expect(res.body.data.addUser).to.have.property("email", mocks_1.TestMock.user.email);
            expect(res.body.data.addUser).to.have.property("location", mocks_1.TestMock.user.location);
            expect(res.body.data.addUser).to.have.property("title", mocks_1.TestMock.user.title);
        })
            .end(done);
    });
    it("should list Users", (done) => {
        request
            .post("/graphql")
            .set(config_1.Auth)
            .send({
            query,
            operationName: "ListingUsers",
            variables: {
                uid: mocks_1.TestMock.user.kerberosID
            }
        })
            .expect((res) => {
            expect(res.body).to.not.have.property("errors");
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.have.property("listUsers");
            expect(res.body.data.listUsers).to.be.an("array");
            expect(res.body.data.listUsers).to.not.have.lengthOf(0);
            expect(res.body.data.listUsers[0]).to.have.property("_id");
            expect(res.body.data.listUsers[0]).to.have.property("kerberosID");
            expect(res.body.data.listUsers[0]).to.have.property("name");
            expect(res.body.data.listUsers[0]).to.have.property("email");
            expect(res.body.data.listUsers[0]).to.have.property("location");
            expect(res.body.data.listUsers[0]).to.have.property("title");
            expect(res.body.data).to.have.property("getUser");
            expect(res.body.data.getUser).to.be.an("object");
            expect(res.body.data.getUser).to.have.property("_id", mocks_1.TestMock.user._id);
            expect(res.body.data.getUser).to.have.property("kerberosID", mocks_1.TestMock.user.kerberosID);
            expect(res.body.data.getUser).to.have.property("name", mocks_1.TestMock.user.name);
            expect(res.body.data.getUser).to.have.property("email", mocks_1.TestMock.user.email);
            expect(res.body.data.getUser).to.have.property("location", mocks_1.TestMock.user.location);
            expect(res.body.data.getUser).to.have.property("title", mocks_1.TestMock.user.title);
        })
            .end((err, res) => {
            done(err);
        });
    });
    it("should update the User", (done) => {
        request
            .post("/graphql")
            .set(config_1.Auth)
            .send({
            query,
            operationName: "UpdatingUser",
            variables: {
                input: mocks_1.TestMock.user
            }
        })
            .expect((res) => {
            expect(res.body).to.not.have.property("errors");
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.have.property("updateUser");
            expect(res.body.data.updateUser).to.be.an("object");
            expect(res.body.data.updateUser).to.have.property("_id", mocks_1.TestMock.user._id);
            expect(res.body.data.updateUser).to.have.property("kerberosID", mocks_1.TestMock.user.kerberosID);
            expect(res.body.data.updateUser).to.have.property("name", mocks_1.TestMock.user.name);
            expect(res.body.data.updateUser).to.have.property("email", mocks_1.TestMock.user.email);
            expect(res.body.data.updateUser).to.have.property("location", mocks_1.TestMock.user.location);
            expect(res.body.data.updateUser).to.have.property("title", mocks_1.TestMock.user.title);
        })
            .end(done);
    });
    it("should delete the user", (done) => {
        request
            .post("/graphql")
            .set(config_1.Auth)
            .send({
            query,
            operationName: "DeletingUser",
            variables: {
                _id: mocks_1.TestMock.user._id
            }
        })
            .expect((res) => {
            expect(res.body).to.not.have.property("errors");
            expect(res.body).to.have.property("data");
            expect(res.body.data).to.have.property("deleteUser");
            expect(res.body.data.deleteUser).to.be.an("object");
            expect(res.body.data.deleteUser).to.have.property("_id", mocks_1.TestMock.user._id);
            expect(res.body.data.deleteUser).to.have.property("kerberosID", mocks_1.TestMock.user.kerberosID);
            expect(res.body.data.deleteUser).to.have.property("name", mocks_1.TestMock.user.name);
            expect(res.body.data.deleteUser).to.have.property("email", mocks_1.TestMock.user.email);
            expect(res.body.data.deleteUser).to.have.property("location", mocks_1.TestMock.user.location);
            expect(res.body.data.deleteUser).to.have.property("title", mocks_1.TestMock.user.title);
        })
            .end(done);
    });
});
