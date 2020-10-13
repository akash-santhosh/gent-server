import { Request, Response, NextFunction, Router } from "express";
import { User } from "./schema";
import { createClient } from "ldapjs";
import { config } from "../../config/config";
import * as async from "async";

/**
 * @class UsersApi
 */

export class UsersApi {
  router: Router;

  /**
   * Initializing Constructor to get list of Users by default
  */
  constructor(router: Router) {
    this.router = router;
    // Binding the functions on class instance for all APIs
    this.router.get("/users/:uid/details", this.getUserDetails.bind(this));
  }

  public getUserDetails(req: Request, res: Response, next: NextFunction) {
    const U_ID = "uid";
    const user = { profile: {}, preferences: {} };
    async.parallel([
      (callback: any) => {
        User.findOne({ "kerberosID": req.params[U_ID] })
          .populate({ path: "teams.name", select: "name description" })
          .exec().then((users: any) => {
            if (users) {
              user.preferences = users;
            }
            callback();
          }).catch(next);
      }
    ], (error) => {
      if (error) {
        console.log(error);
      } else {
        res.json(user);
        next();
        return user;
      }
    });
  }
}
