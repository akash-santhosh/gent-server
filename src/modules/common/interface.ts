import { IUser } from "../users/interface";

export interface ITimestamp {
  createdAt: Date;
  createdBy: IUser;
  modifiedAt?: string;
  modifiedBy?: IUser;
}

export interface IUpdates {
  text: string;
  updatedBy: string;
  updatedAt: Date;
}

export interface IUserProfile {
  kerberosID: string;
  name: string;
  email: string;
}
