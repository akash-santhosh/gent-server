"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const schema_1 = require("./schema");
const helpers_1 = require("../common/helpers");
const USER_ADD = "USER_ADD";
const USER_REMOVE = "USER_REMOVE";
exports.resolver = {
    Subscription: {
        userAdd: {
            subscribe: () => helpers_1.pubsub.asyncIterator(USER_ADD)
        },
        userRemove: {
            subscribe: () => helpers_1.pubsub.asyncIterator(USER_REMOVE)
        }
    },
    Query: {
        getUser(root, args, ctx) {
            return schema_1.User.findOne({ kerberosID: args.uid })
                .then(data => data)
                .catch(err => err);
        },
        listUsers() {
            return schema_1.User.find()
                .then(data => data)
                .catch(err => err);
        },
    },
    Mutation: {
        addUser(root, args, ctx) {
            const data = new schema_1.User(args.input);
            data.isActive = true;
            return data.save()
                .then(response => {
                helpers_1.pubsub.publish(USER_ADD, { userAdd: response });
                return response;
            })
                .catch(err => err);
        },
        deleteUser(root, args, ctx) {
            return schema_1.User.findByIdAndRemove(args._id)
                .then(response => {
                helpers_1.pubsub.publish(USER_REMOVE, { userRemove: response });
                return response;
            })
                .catch(err => err);
        },
        updateUser(root, args, ctx) {
            return schema_1.User.findById(args.input._id)
                .then(response => {
                return Object.assign(response, args.input)
                    .save()
                    .then((user) => {
                    return user;
                });
            })
                .catch((err) => err);
        }
    }
};
