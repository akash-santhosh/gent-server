import { ITimestamp } from "../common/interface";

export interface IUserTeam {
  name: string;
  access: number;
  primary: Boolean;
}

export interface IUser {
  kerberosID: string;
  name?: string;
  email?: string;
  location?: string;
  title?: string;
  isActive: Boolean;
  teams?: IUserTeam[];
  timestamp?: ITimestamp;
}
