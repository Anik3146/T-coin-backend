"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
// src/data-source.ts
const dotenv = __importStar(require("dotenv"));
const typeorm_1 = require("typeorm");
const ActivityLog_1 = require("./entities/ActivityLog");
const AppInfo_1 = require("./entities/AppInfo");
const Banners_1 = require("./entities/Banners");
const Contact_1 = require("./entities/Contact");
const DeviceInfo_1 = require("./entities/DeviceInfo");
const SocialMedia_1 = require("./entities/SocialMedia");
const TransactionHistory_1 = require("./entities/TransactionHistory");
const User_1 = require("./entities/User");
const Notifications_1 = require("./entities/Notifications");
const BreakingNews_1 = require("./entities/BreakingNews");
// Add other entities as required
dotenv.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || "3306"),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        ActivityLog_1.ActivityLog,
        AppInfo_1.AppInfo,
        Banners_1.Banners,
        Contact_1.ContactUs,
        DeviceInfo_1.DeviceInfo,
        SocialMedia_1.SocialMedia,
        TransactionHistory_1.TransactionHistory,
        User_1.User,
        Notifications_1.Notification,
        BreakingNews_1.BreakingNews,
    ], // Include all entities
    synchronize: true,
    logging: true,
});
