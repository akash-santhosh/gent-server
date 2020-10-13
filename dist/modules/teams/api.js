"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const schema_2 = require("../users/schema");
const async = require("async");
class TeamsApi {
    constructor(router) {
        this.router = router;
        this.teams = this.init();
        this.router.post("/teams", this.create.bind(this));
        this.router.get("/teams_by_url/:url", this.getByUrl.bind(this));
        this.router.get("/teams/:id([0-9a-f]{24})", this.get.bind(this));
        this.router.put("/teams/:id([0-9a-f]{24})", this.update.bind(this));
        this.router.delete("/teams/:id([0-9a-f]{24})", this.delete.bind(this));
        this.router.get("/teams/:name", this.getTeamByName.bind(this));
        this.router.get("/teams/:id([0-9a-f]{24})/members", this.getMembers.bind(this));
    }
    list(req, res, next) {
        schema_1.Team.find().populate({ path: "modules", select: "name" }).then(teams => {
            res.json(teams);
            return teams;
        }).catch(next);
    }
    create(req, res, next) {
        const team = new schema_1.Team(req.body);
        team.save().then(data => {
            res.json(data);
            next();
        }).catch(next);
    }
    get(req, res, next) {
        const PARAM_ID = "id";
        if (req.params[PARAM_ID] === undefined) {
            res.sendStatus(400);
            next();
            return;
        }
        else {
            const id = req.params[PARAM_ID];
            const result = {
                details: {},
                members: []
            };
            async.parallel([
                (callback) => {
                    schema_1.Team.findById(id).populate({ path: "modules", select: "name" }).then((team) => {
                        result.details = team;
                        callback();
                    }).catch(next);
                },
                (callback) => {
                    schema_2.User.find({ "teams": { $elemMatch: { "name": id } } }).then(users => {
                        result.members = users;
                        callback();
                    }).catch(next);
                }
            ], (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.json(result);
                }
            });
        }
    }
    getByUrl(req, res, next) {
        const PARAM_URL = "url";
        if (req.params[PARAM_URL] === undefined) {
            res.sendStatus(400);
            next();
            return;
        }
        else {
            const url = req.params[PARAM_URL];
            const result = {
                details: {},
                members: []
            };
            async.series([
                (series) => {
                    schema_1.Team.find({ url: url }).populate({ path: "modules", select: "name" }).then((team) => {
                        result.details = team[0];
                        series();
                    }).catch(next);
                },
                (series) => {
                    async.parallel([
                        (callback) => {
                            schema_2.User.find({
                                "teams": { $elemMatch: { "name": result.details._id } }
                            }).then(users => {
                                result.members = users;
                                callback();
                            }).catch(next);
                        }
                    ], (error) => {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            series();
                        }
                    });
                },
            ], (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    res.json(result);
                }
            });
        }
    }
    update(req, res, next) {
        if (req.body === undefined) {
            res.sendStatus(400);
            next();
            return;
        }
        else {
            schema_1.Team.findByIdAndUpdate({ _id: req.body._id }, { $set: req.body }, (err, team) => {
                if (err) {
                    res.sendStatus(400);
                    return next(err);
                }
                else {
                    res.json(team);
                    return next();
                }
            });
        }
    }
    delete(req, res, next) {
        const PARAM_ID = "id";
        if (req.params[PARAM_ID] === undefined) {
            res.sendStatus(400);
            next();
            return;
        }
        else {
            const id = req.params[PARAM_ID];
            schema_1.Team.findByIdAndRemove(id).then(() => {
                res.status(200).json({ message: "Deleted Successfully" });
                next();
            }).catch(next);
        }
    }
    getTeamByName(req, res, next) {
        const name = "name";
        if (req.params[name] === undefined) {
            res.sendStatus(400);
            next();
            return;
        }
        else {
            const teamName = req.params[name];
            schema_1.Team.find({ name: teamName }).then((team) => {
                res.json(team);
            }).catch(next);
        }
    }
    getMembers(req, res, next) {
        const PARAM_ID = "id";
        if (req.params[PARAM_ID] === undefined) {
            res.sendStatus(400);
            next();
            return;
        }
        else {
            const id = req.params[PARAM_ID];
            schema_2.User.find({ "teams": { $elemMatch: { "name": id } } }).then(users => {
                res.json(users);
            }).catch(next);
        }
    }
    init() {
        return this.router.get("/teams", this.list.bind(this));
    }
}
exports.TeamsApi = TeamsApi;
