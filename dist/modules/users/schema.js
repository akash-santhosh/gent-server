"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.UserSchema = new mongoose_1.Schema({
    kerberosID: String,
    name: String,
    email: String,
    location: String,
    title: String,
    isActive: Boolean,
    teams: [{
            name: { type: mongoose_1.Schema.Types.ObjectId, ref: "Team" },
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
exports.User = mongoose_1.model("User", exports.UserSchema);
