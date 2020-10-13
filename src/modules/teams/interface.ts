import { ITimestamp } from "../common/interface";
import { IUser } from "../users/interface";

export interface ITeamOwner {
  kerberosID: string;
  name: string;
  email: string;
  primary: boolean;
}

export interface ICoverage {
  hours: number;
  day: number;
}

export interface IServiceGuarentees {
  name: string;
  initialResponse: number;
  updatesFrequency: number;
  coverageDuration: ICoverage;
}

export interface ITeamSLA {
  severity: string;
  level: IServiceGuarentees[];
}

export interface ITeamQuicklinks {
  name: string;
  url: string;
}

export interface IJIRAProjectCategory {
  name: string;
  url: string;
}

export interface ITeam {
  name: string;
  url: string;
  ticketUrl: string;
  externalUrl: string;
  description: string;
  vision: string;
  mission: string;
  mailingList: string;
  manager: IUser;
  ircChannel: string;
  parentTeam: string;
  ownership: ITeamOwner[];
  sla?: ITeamSLA[];
  quickLinks?: ITeamQuicklinks[];
  jiraProjectCategory?: IJIRAProjectCategory;
  timestamp: ITimestamp;
  isFeedbackActive: Boolean;
}
