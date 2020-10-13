"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("../users/schema");
const async = require("async");
const schema_2 = require("./schema");
const helpers_1 = require("../common/helpers");
const TEAM_ADD = "TEAM_ADD";
const TEAM_REMOVE = "TEAM_REMOVE";
exports.resolver = {
    Subscription: {
        teamAdd: {
            subscribe: () => helpers_1.pubsub.asyncIterator(TEAM_ADD)
        },
        teamRemove: {
            subscribe: () => helpers_1.pubsub.asyncIterator(TEAM_REMOVE)
        }
    },
    Query: {
        listTeams(root, args, ctx) {
            return schema_2.Team.find()
                .populate({ path: "parentTeam" })
                .then(team => team)
                .catch(error => error);
        },
        getTeam(root, args, ctx) {
            return schema_2.Team
                .findById(args._id)
                .populate({ path: "modules" })
                .then(team => team)
                .catch(error => error);
        },
        getTeamBy(root, args, ctx) {
            const searchObject = Object.keys(args.key);
            return schema_2.Team.find()
                .then(teams => {
                const result = teams.filter((team) => {
                    const teamKey = searchObject[0];
                    return team[teamKey] === args.key[teamKey];
                });
                return result;
            })
                .catch(error => error);
        },
        getTeamMembersByID(root, args, ctx) {
            return schema_1.User.find({
                $and: [
                    { "teams": { $elemMatch: { "name": args._id } } },
                    { "isActive": true, }
                ]
            })
                .then(users => users)
                .catch(error => error);
        },
    },
    Mutation: {
        addTeam(root, args, ctx) {
            const team = new schema_2.Team(args.input);
            return team.save()
                .then(response => {
                helpers_1.pubsub.publish(TEAM_ADD, { teamAdd: response });
                return response;
            })
                .catch(error => error);
        },
        updateTeam(root, args, ctx) {
            return schema_2.Team.findById(args.input._id)
                .then(response => {
                return Object.assign(response, args.input).save()
                    .then((team) => team);
            }).catch(error => error);
        },
        deleteTeam(root, args, ctx) {
            return schema_2.Team.findByIdAndRemove(args._id)
                .then(response => {
                helpers_1.pubsub.publish(TEAM_REMOVE, { teamRemove: response });
                return response;
            })
                .catch((error) => error);
        },
        manageMembers(root, args, ctx) {
            let count = 0;
            return async.whilst(() => {
                return count < args.input.members.length;
            }, (callback) => {
                const member = args.input.members[count];
                schema_1.User.find({ kerberosID: member.kerberosID }).then(user => {
                    if (user[0]) {
                        const teamMember = Object.assign(user[0], member);
                        teamMember.save((err, data) => {
                            count++;
                            callback(null, null);
                        });
                    }
                    else if (args.input.action === "add") {
                        const teamMember = new schema_1.User(member);
                        teamMember.save((err, data) => {
                            count++;
                            callback(null, null);
                        });
                    }
                });
            }, (error) => {
                if (error) {
                    console.log(error);
                }
                else {
                    return {
                        status: `All members
                ${args.input.action.endsWith("e")
                            ? args.input.action.slice(0, -1)
                            : args.input.action}ed successfully`
                    };
                }
            });
        }
    }
};
