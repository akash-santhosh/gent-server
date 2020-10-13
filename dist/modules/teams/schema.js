"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.TeamSchema = new mongoose_1.Schema({
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
    parentTeam: { type: mongoose_1.Schema.Types.ObjectId, ref: "Team" },
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
exports.Team = mongoose_1.model("Team", exports.TeamSchema);
