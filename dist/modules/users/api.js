"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const async = require("async");
class UsersApi {
    constructor(router) {
        this.router = router;
        this.router.get("/users/:uid/details", this.getUserDetails.bind(this));
    }
    getUserDetails(req, res, next) {
        const U_ID = "uid";
        const user = { profile: {}, preferences: {} };
        async.parallel([
            (callback) => {
                schema_1.User.findOne({ "kerberosID": req.params[U_ID] })
                    .populate({ path: "teams.name", select: "name description" })
                    .exec().then((users) => {
                    if (users) {
                        user.preferences = users;
                    }
                    callback();
                }).catch(next);
            }
        ], (error) => {
            if (error) {
                console.log(error);
            }
            else {
                res.json(user);
                next();
                return user;
            }
        });
    }
}
exports.UsersApi = UsersApi;
