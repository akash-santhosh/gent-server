"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_tools_1 = require("graphql-tools");
const typeDef_1 = require("./common/typeDef");
const typeDef_2 = require("./users/typeDef");
const resolver_1 = require("./users/resolver");
const typeDef_3 = require("./teams/typeDef");
const resolver_2 = require("./teams/resolver");
exports.Schema = graphql_tools_1.mergeSchemas({
    schemas: [
        typeDef_1.typeDef,
        typeDef_2.typeDefUsers,
        typeDef_3.typeDefTeam,
        typeDef_2.queryTypeDefUsers,
        typeDef_3.queryTypeDefTeam,
        typeDef_2.subscriptionTypeDefUsers,
        typeDef_2.mutationTypeDefUsers,
        typeDef_3.mutationTypeDefTeam,
        typeDef_3.subscriptionTypeDefTeam,
    ],
    resolvers: [resolver_1.resolver, resolver_2.resolver],
});
