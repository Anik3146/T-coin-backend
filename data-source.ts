// src/data-source.ts
import * as dotenv from "dotenv";
import { DataSource } from "typeorm";
import { ActivityLog } from "./entities/ActivityLog";
import { AppInfo } from "./entities/AppInfo";
import { Banners } from "./entities/Banners";
import { ContactUs } from "./entities/Contact";
import { DeviceInfo } from "./entities/DeviceInfo";
import { SocialMedia } from "./entities/SocialMedia";
import { TransactionHistory } from "./entities/TransactionHistory";
import { User } from "./entities/User";
import { Notification } from "./entities/Notifications";
import { BreakingNews } from "./entities/BreakingNews";
import { Agent } from "./entities/Agent";
import { Admin } from "./entities/Admin";
import { Savings } from "./entities/Savings";
import { Investment } from "./entities/Investment";
import { InvestmentProject } from "./entities/InvestmentProject";
import { MFSService } from "./entities/MFSservice";
import { Referral } from "./entities/Referral";

// Add other entities as required
dotenv.config();
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "3306"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    ActivityLog,
    AppInfo,
    Banners,
    ContactUs,
    DeviceInfo,
    SocialMedia,
    TransactionHistory,
    User,
    Notification,
    BreakingNews,
    Agent,
    Admin,
    Savings,
    Investment,
    InvestmentProject,
    MFSService,
    Referral,
  ], // Include all entities
  synchronize: true,
  logging: true,
});
