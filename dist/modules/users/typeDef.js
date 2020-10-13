"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeDefUsers = `
type UserTeamType {
  name: String
  access: String
  primary: Boolean
}

input UserTeamInput {
  name: String
  access: String
  primary: Boolean
}

type UserType {
  _id: String
  kerberosID: String
  name: String
  email: String
  location: String
  title: String
  teams: [UserTeamType]
  timestamp: TimestampType
}

input UserInput {
  _id: String
  kerberosID: String
  name: String
  email: String
  location: String
  title: String
  teams: UserTeamInput
  timestamp: TimestampInput
}
`;
exports.mutationTypeDefUsers = `
type Mutation {
  # Add a new User
  addUser(input: UserInput): UserType
  # Update existing User
  updateUser(input: UserInput): UserType
  # Delete a User by ID
  deleteUser(_id: String!): UserType
}
`;
exports.queryTypeDefUsers = `
type Query {
  # Fetches specific User by id
  getUser(uid: String!): UserType
  # Fetches all Users
  listUsers: [UserType]
}
`;
exports.subscriptionTypeDefUsers = `
type Subscription {
  userAdd: UserType
  userRemove: UserType
}
`;
