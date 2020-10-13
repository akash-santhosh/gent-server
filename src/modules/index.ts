import { mergeSchemas } from "graphql-tools";
import { typeDef } from "./common/typeDef";

// User Query, Mutation, Subscription typedefs
import { typeDefUsers, mutationTypeDefUsers, queryTypeDefUsers, subscriptionTypeDefUsers } from "./users/typeDef";
import { resolver as UserResolver } from "./users/resolver";

import { typeDefTeam, queryTypeDefTeam, mutationTypeDefTeam, subscriptionTypeDefTeam } from "./teams/typeDef";
import { resolver as TeamResolver } from "./teams/resolver";

// Schema merging which has mutation, queries & subscriptions
export const Schema = mergeSchemas({
  schemas: [
    typeDef,
    typeDefUsers,
    typeDefTeam,
    queryTypeDefUsers,
    queryTypeDefTeam,
    subscriptionTypeDefUsers,
    mutationTypeDefUsers,
    mutationTypeDefTeam,
    subscriptionTypeDefTeam,
  ],
  resolvers: [UserResolver, TeamResolver],
});
