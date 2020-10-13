import { User, IUserModel } from "../users/schema";
import * as async from "async";
import { Team, ITeamModel } from "./schema";
import { pubsub } from "../common/helpers";
const TEAM_ADD = "TEAM_ADD";
const TEAM_REMOVE = "TEAM_REMOVE";

export const resolver = {
  Subscription: {
    teamAdd: {
      subscribe: () => pubsub.asyncIterator(TEAM_ADD)
    },
    teamRemove: {
      subscribe: () => pubsub.asyncIterator(TEAM_REMOVE)
    }
  },
  Query: {
    /**
     * @description returns the Array of Teams.
     * @returns Team Array with Type of PopulatedTeamType Ref( typeDef Line no: 110, 33)
     */
    listTeams(root: any, args: any, ctx: any) {
      return Team.find()
        .populate({ path: "parentTeam" })
        .then(team => team)
        .catch(error => error);
    },

    /**
     * @description returns team details by id
     * @returns Team with Type of PopulatedTeamType Ref( typeDef Line no: 108, 33)
     */
    getTeam(root: any, args: any, ctx: any) {
      return Team
        .findById(args._id)
        .populate({ path: "modules" })
        .then(team => team)
        .catch(error => error);
    },

    /**
     * @description needs an object with property name and value.
     * @returns Team Array with Type of PopulatedTeamType Ref( typeDef Line no: 110, 33)
     */
    getTeamBy(root: any, args: any, ctx: any) {
      const searchObject = Object.keys(args.key);
      return Team.find()
        .then(teams => {
          const result = teams.filter((team: any) => {
            const teamKey: any = searchObject[0];
            return team[teamKey] === args.key[teamKey];
          });
          return result;
        })
        .catch(error => error);
    },

    /**
     * fetches team member of Array by ID
     */
    getTeamMembersByID(root: any, args: any, ctx: any) {
      return User.find({
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
    /**
     * Add a new team
     */
    addTeam(root: any, args: any, ctx: any) {
      const team = new Team(args.input);
      return team.save()
        .then(response => {
          pubsub.publish(TEAM_ADD, { teamAdd: response });
          return response;
        })
        .catch(error => error);
    },

    /**
     * updated teams.
     */
    updateTeam(root: any, args: any, ctx: any) {
      return Team.findById(args.input._id)
        .then(response => {
          return Object.assign(response, args.input).save()
            .then((team: any) => team);
        }).catch(error => error);
    },

    /**
     * Removes the team by Id
     */
    deleteTeam(root: any, args: any, ctx: any) {
      return Team.findByIdAndRemove(args._id)
        .then(response => {
          pubsub.publish(TEAM_REMOVE, { teamRemove: response });
          return response;
        })
        .catch((error: any) => error);
    },

    manageMembers(root: any, args: any, ctx: any) {
      let count = 0;
      return async.whilst(
        () => {
          return count < args.input.members.length;
        },
        (callback: any) => {
          const member = args.input.members[count];
          User.find({ kerberosID: member.kerberosID }).then(user => {
            if (user[0]) {
              const teamMember = Object.assign(user[0], member);
              teamMember.save((err: Error, data: IUserModel) => {
                count++;
                callback(null, null);
              });
            } else if (args.input.action === "add") {
              /**
               * If the user is not present, create a new one
               */
              const teamMember = new User(member);
              teamMember.save((err: Error, data: IUserModel) => {
                count++;
                callback(null, null);
              });
            }
          });
        },
        (error) => {
          if (error) {
            console.log(error);
          } else {
            return {
              status: `All members
                ${args.input.action.endsWith("e")
                  ? args.input.action.slice(0, -1)
                  : args.input.action}ed successfully`
            };
          }
        }
      );
    }
  }
};
