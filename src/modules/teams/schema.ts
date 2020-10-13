import { Document, Schema, Model, model } from "mongoose";
import { ITeam } from "./interface";

export interface ITeamModel extends ITeam, Document { }

export interface ITeamModelStatic extends Model<ITeamModel> { }

export const TeamSchema: Schema = new Schema({
  name: String,
  url: String,
  ticketUrl: String,
  externalUrl: String,
  referenceUrl: String,
  description: String,
  vision: String,
  mission: String,
  mailingList: String,
  manager: {
    kerberosID: String,
    name: String,
    email: String,
  },
  ircChannel: String,
  parentTeam: { type: Schema.Types.ObjectId, ref: "Team" },
  ownership: [{
    kerberosID: String,
    name: String,
    email: String,
    primary: Boolean
  }],
  isFeedbackActive: { type: Boolean, default: false },
  quicklinks: [{
    name: String,
    url: String
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

export const Team: Model<ITeamModel> = model<ITeamModel, ITeamModelStatic>("Team", TeamSchema);
