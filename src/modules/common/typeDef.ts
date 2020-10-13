
export const typeDef = `

scalar DateTime

type ProfileType {
  kerberosID: String
  name: String
  email: String
}

type TimestampType {
  createdAt: DateTime
  createdBy: ProfileType
  modifiedAt: DateTime
  modifiedBy: ProfileType
}

input ProfileInput {
  kerberosID: String
  name: String
  email: String
}

input TimestampInput {
  createdAt: DateTime
  createdBy: ProfileInput
  modifiedAt: DateTime
  modifiedBy: ProfileInput
}

type AccessProfileType {
  kerberosID: String
  name: String
  email: String
  access: Int
}

input AccessProfileInput {
  kerberosID: String
  name: String
  email: String
  access: Int
}
`;
