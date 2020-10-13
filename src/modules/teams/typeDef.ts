export const typeDefTeam = `
type OwnershipType {
  kerberosID: String
  name: String
  email: String
  primary: Boolean
}

input OwnershipInput {
  kerberosID: String
  name: String
  email: String
  primary: Boolean
}

input userTeamsInput {
  name: String
  access: Int
  primary: Boolean
}

input ManageTeamMembersInput {
  _id: String
  members: [TeamUserInput]
  action: String
}

type TeamQuicklinksType {
  name: String
  url: String
}

input TeamQuicklinksInput {
  name: String
  url: String
}

type ManagerType {
  kerberosID: String
  name: String
  email: String
}

input ManagerInput {
  kerberosID: String
  name: String
  email: String
}

type PopulatedTeamType {
  _id: String
  name: String
  url: String
  ticketUrl: String
  externalUrl: String
  referenceUrl: String
  description: String
  vision: String
  mission: String
  mailingList: String
  manager: ManagerType
  ircChannel: String
  parentTeam: TeamType
  ownership: [OwnershipType]
  quicklinks: [TeamQuicklinksType]
  timestamp: TimestampType
}

type TeamType {
  _id: String
  name: String
  url: String
  ticketUrl: String
  externalUrl: String
  referenceUrl: String
  description: String
  vision: String
  mission: String
  mailingList: String
  manager: ManagerType
  ircChannel: String
  parentTeam: String
  ownership: [OwnershipType]
  isFeedbackActive: Boolean
  quicklinks: [TeamQuicklinksType]
  timestamp: TimestampType
}

input TeamInput {
  _id: String
  name: String
  ticketUrl: String
  externalUrl: String
  url: String
  description: String
  vision: String
  mission: String
  mailingList: String
  manager: ManagerInput
  ircChannel: String
  referenceUrl: String
  parentTeam: String
  ownership: [OwnershipInput]
  quicklinks: [TeamQuicklinksInput]
  timestamp: TimestampInput
}

type userTeams {
  name: String
  access: Int
  primary: Boolean
}

type TeamUser {
  _id: String
  kerberosID: String
  name: String
  email: String
  location: String
  title: String
  teams: [userTeams]
  timestamp: TimestampType
}

type PopulatedUserTeams {
  name: TeamType
  access: Int
  primary: Boolean
}

type PopulatedTeamUser {
  _id: String
  kerberosID: String
  name: String
  email: String
  location: String
  title: String
  teams: [PopulatedUserTeams]
  timestamp: TimestampType
}

input TeamUserInput {
  _id: String
  kerberosID: String
  name: String
  email: String
  location: String
  title: String
  teams: [userTeamsInput]
  timestamp: TimestampInput
}


type ManageTeamMembersType {
  _id: String
  members: [TeamUser]
  action: String
}

type TeamMembersSuccessType {
  status: String
}
`;

export const mutationTypeDefTeam = `
type Mutation {
  #Add a new team
  addTeam(input: TeamInput): TeamType

  # update team
  updateTeam(input: TeamInput): TeamType

  # delete a team
  deleteTeam(_id: String!): TeamType

  # manages members of a team bu add and update actions
  manageMembers(input: ManageTeamMembersInput): ManageTeamMembersType
}
`;

export const queryTypeDefTeam = `
type Query {
  #fetch specific team by id
  getTeam(_id: String): PopulatedTeamType

  # fetches all teams
  listTeams: [PopulatedTeamType]

  # fetches specific team by key name
  getTeamBy( key: TeamInput ): [PopulatedTeamType]

  # fetches members of team by team ID
  getTeamMembersByID( _id: String ): [TeamUser]
}
`;

export const subscriptionTypeDefTeam = `
type Subscription {
  teamAdd: TeamType
  teamRemove: TeamType
}
`;
