"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.addOrUpdateAppInfoForUser = void 0;
const data_source_1 = require("../data-source");
const AppInfo_1 = require("../entities/AppInfo");
const User_1 = require("../entities/User");
// Add or update app information for a specific user
const addOrUpdateAppInfoForUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const appInfoRepo = data_source_1.AppDataSource.getRepository(AppInfo_1.AppInfo);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const { title, subtitle, description, shareLink, privacyPolicy, latest_app_version, latest_ios_version, is_update_available, update_note, google_play_update_link, app_store_update_link, } = req.body;
        // Extract user ID from request params
        const userId = req.params.userId;
        // Find the user and load the associated app_info relation
        const user = yield userRepo.findOne({
            where: { id: Number(userId) },
            relations: ["app_info"], // Ensure we load the app_info relation
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }
        let appInfo = user.app_info || null;
        if (appInfo) {
            // If app info exists, update it
            appInfo.title = title || appInfo.title;
            appInfo.subtitle = subtitle || appInfo.subtitle;
            appInfo.description = description || appInfo.description;
            appInfo.shareLink = shareLink || appInfo.shareLink;
            appInfo.privacyPolicy = privacyPolicy || appInfo.privacyPolicy;
            appInfo.latest_app_version =
                latest_app_version || appInfo.latest_app_version;
            appInfo.latest_ios_version =
                latest_ios_version || appInfo.latest_ios_version;
            appInfo.is_update_available =
                is_update_available || appInfo.is_update_available;
            appInfo.update_note = update_note || appInfo.update_note;
            appInfo.google_play_update_link =
                google_play_update_link || appInfo.google_play_update_link;
            appInfo.app_store_update_link =
                app_store_update_link || appInfo.app_store_update_link;
            appInfo.updatedAt = new Date();
            yield appInfoRepo.save(appInfo);
            return res.status(200).json({
                success: true,
                message: "App information updated successfully for user.",
                data: appInfo,
            });
        }
        else {
            // If no app info exists, create a new one
            appInfo = appInfoRepo.create({
                title,
                subtitle,
                description,
                shareLink,
                privacyPolicy,
                latest_app_version,
                latest_ios_version,
                is_update_available,
                update_note,
                google_play_update_link,
                app_store_update_link,
                createdAt: new Date(),
                updatedAt: new Date(),
            });
            yield appInfoRepo.save(appInfo);
            // Link the new app info to the user
            user.app_info = appInfo;
            yield userRepo.save(user);
            return res.status(201).json({
                success: true,
                message: "App information added and linked to user successfully.",
                data: appInfo,
            });
        }
    }
    catch (error) {
        console.error("Error in adding/updating app information for user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addOrUpdateAppInfoForUser = addOrUpdateAppInfoForUser;
