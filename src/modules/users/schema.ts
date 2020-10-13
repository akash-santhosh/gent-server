import { Document, Schema, Model, model } from "mongoose";
import { IUser } from "./interface";

export interface IUserModel extends IUser, Document { }

export interface IUserModelStatic extends Model<IUserModel> { }

export const UserSchema: Schema = new Schema({
  kerberosID: String,
  name: String,
  email: String,
  location: String,
  title: String,
  isActive: Boolean,
  teams: [{
    name: { type: Schema.Types.ObjectId, ref: "Team" },
    access: Number,
    primary: Boolean
  }],
  timestamp: {
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      kerberosID: String,
      name: String,
      email: String
    },
    modifiedAt: { type: Date },
    modifiedBy: {
      kerberosID: String,
      name: String,
      email: String
    }
  }
});

export const User: Model<IUserModel> = model<IUserModel, IUserModelStatic>("User", UserSchema);
