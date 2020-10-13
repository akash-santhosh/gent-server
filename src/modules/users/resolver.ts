import { User } from "./schema";
import { pubsub } from "../common/helpers";
const USER_ADD = "USER_ADD";
const USER_REMOVE = "USER_REMOVE";

export const resolver = {
  Subscription: {
    userAdd: {
      subscribe: () => pubsub.asyncIterator(USER_ADD)
    },
    userRemove: {
      subscribe: () => pubsub.asyncIterator(USER_REMOVE)
    }
  },
  Query: {
    getUser(root: any, args: any, ctx: any) {
      return User.findOne({ kerberosID: args.uid })
        .then(data => data)
        .catch(err => err);
    },
    listUsers() {
      return User.find()
        .then(data => data)
        .catch(err => err);
    },
  },
  Mutation: {
    addUser(root: any, args: any, ctx: any) {
      const data = new User(args.input);
      data.isActive = true;
      return data.save()
        .then(response => {
          pubsub.publish(USER_ADD, { userAdd: response });
          return response;
        })
        .catch(err => err);
    },
    deleteUser(root: any, args: any, ctx: any) {
      return User.findByIdAndRemove(args._id)
        .then(response => {
          pubsub.publish(USER_REMOVE, { userRemove: response });
          return response;
        })
        .catch(err => err);
    },
    updateUser(root: any, args: any, ctx: any) {
      return User.findById(args.input._id)
        .then(response => {
          return Object.assign(response, args.input)
            .save()
            .then((user: any) => {
              return user;
            });
        })
        .catch((err: any) => err);
    }
  }
};
