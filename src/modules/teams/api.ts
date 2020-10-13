import { Request as ExpressRequest, Response, NextFunction, Router } from "express";
import { Team, ITeamModel } from "./schema";
import { User } from "../users/schema";
import * as async from "async";

/**
 * @class TeamsApi
 */

export class TeamsApi {
  router: Router;
  teams: ITeamModel[];

  /**
    * Initializing Constructor to get list of Teams by default
    */
  constructor(router: Router) {
    this.router = router;
    // Initializing base GET API
    this.teams = this.init();
    // Binding the functions on class instance for all APIs
    // 1
    this.router.post("/teams", this.create.bind(this));

    // Migrated to graphQL
    // can be achieved by getTeamBy
    // 2
    this.router.get("/teams_by_url/:url", this.getByUrl.bind(this));

    // Migrated to graphQL
    // can be achieved by getTeamBy
    // 3
    this.router.get("/teams/:id([0-9a-f]{24})", this.get.bind(this));

    // Halted
    // 4 5 6
    this.router.put("/teams/:id([0-9a-f]{24})", this.update.bind(this));
    this.router.delete("/teams/:id([0-9a-f]{24})", this.delete.bind(this));

    // Migrated to graphQL
    // can be achieved by getTeamBy
    // 7
    this.router.get("/teams/:name", this.getTeamByName.bind(this));

    // Migrated to graphQL
    // can be achieved by getTeamMembersByID( _id: String ): [TeamUser]
    this.router.get("/teams/:id([0-9a-f]{24})/members", this.getMembers.bind(this));

  }

  public list(req: ExpressRequest, res: Response, next: NextFunction) {
    Team.find().populate({ path: "modules", select: "name" }).then(teams => {
      // send json of teams object
      res.json(teams);
      // next();
      return teams;
    }).catch(next);
  }

  public create(req: ExpressRequest, res: Response, next: NextFunction) {
    const team = new Team(req.body);
    team.save().then(data => {
      res.json(data);
      next();
    }).catch(next);
  }

  public get(req: ExpressRequest, res: Response, next: NextFunction) {
    const PARAM_ID = "id";
    // verify the id parameter exists
    if (req.params[PARAM_ID] === undefined) {
      res.sendStatus(400);
      next();
      return;
    } else {
      // get id
      const id: string = req.params[PARAM_ID];
      const result: any = {
        details: {},
        members: []
      };
      async.parallel([
        (callback: any) => {
          Team.findById(id).populate({ path: "modules", select: "name" }).then((team: any) => {
            result.details = team;
            callback();
          }).catch(next);
        },
        (callback: any) => {
          User.find({ "teams": { $elemMatch: { "name": id } } }).then(users => {
            result.members = users;
            callback();
          }).catch(next);
        }
      ], (error) => {
        if (error) {
          console.log(error);
        } else {
          res.json(result);
        }
      });
    }
  }

  public getByUrl(req: ExpressRequest, res: Response, next: NextFunction) {
    const PARAM_URL = "url";
    // verify the id parameter exists
    if (req.params[PARAM_URL] === undefined) {
      res.sendStatus(400);
      next();
      return;
    } else {
      // get url
      const url: string = req.params[PARAM_URL];
      const result: any = {
        details: {},
        members: []
      };
      async.series([
        (series: any) => {
          Team.find({ url: url }).populate({ path: "modules", select: "name" }).then((team: any) => {
            result.details = team[0];
            series();
          }).catch(next);
        },
        (series: any) => {
          async.parallel([
            (callback: any) => {
              User.find({
                "teams": { $elemMatch: { "name": result.details._id } }
              }).then(users => {
                result.members = users;
                callback();
              }).catch(next);
            }
          ], (error) => {
            if (error) {
              console.log(error);
            } else {
              series();
            }
          });
        },
      ], (error) => {
        if (error) {
          console.log(error);
        } else {
          res.json(result);
        }
      });
    }
  }

  public update(req: ExpressRequest, res: Response, next: NextFunction) {
    // verify the req.body exists
    if (req.body === undefined) {
      res.sendStatus(400);
      next();
      return;
    } else {
      Team.findByIdAndUpdate({ _id: req.body._id }, { $set: req.body }, (err: Error, team) => {
        if (err) {
          res.sendStatus(400);
          return next(err);
        } else {
          res.json(team);
          return next();
        }
      });
    }
  }

  public delete(req: ExpressRequest, res: Response, next: NextFunction) {
    const PARAM_ID = "id";
    // verify the req.params[id] exists
    if (req.params[PARAM_ID] === undefined) {
      res.sendStatus(400);
      next();
      return;
    } else {
      const id: string = req.params[PARAM_ID];
      Team.findByIdAndRemove(id).then(() => {
        res.status(200).json({ message: "Deleted Successfully" });
        next();
      }).catch(next);
    }
  }

  public getTeamByName(req: ExpressRequest, res: Response, next: NextFunction) {
    const name = "name";
    if (req.params[name] === undefined) {
      res.sendStatus(400);
      next();
      return;
    } else {
      const teamName: string = req.params[name];
      Team.find({ name: teamName }).then((team: any) => {
        res.json(team);
      }).catch(next);
    }
  }

  public getMembers(req: ExpressRequest, res: Response, next: NextFunction) {
    const PARAM_ID = "id";
    if (req.params[PARAM_ID] === undefined) {
      res.sendStatus(400);
      next();
      return;
    } else {
      const id: string = req.params[PARAM_ID];
      User.find({ "teams": { $elemMatch: { "name": id } } }).then(users => {
        res.json(users);
      }).catch(next);
    }
  }

  init(): any {
    return this.router.get("/teams", this.list.bind(this));
  }
}
