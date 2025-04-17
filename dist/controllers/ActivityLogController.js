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
exports.deleteActivityLog = exports.updateActivityLog = exports.addActivityLog = exports.getActivityLogsByUserId = exports.getAllActivityLogs = void 0;
const data_source_1 = require("../data-source");
const ActivityLog_1 = require("../entities/ActivityLog");
const User_1 = require("../entities/User");
// Get all activity logs
const getAllActivityLogs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityLogRepo = data_source_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
    try {
        const logs = yield activityLogRepo.find({
            relations: ["user"], // Include related user data
        });
        return res.status(200).json({
            success: true,
            message: "Activity logs fetched successfully.",
            data: logs,
        });
    }
    catch (error) {
        console.error("Error in fetching activity logs:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getAllActivityLogs = getAllActivityLogs;
// Get activity logs by User ID
const getActivityLogsByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityLogRepo = data_source_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
    try {
        const userId = parseInt(req.params.userId, 10);
        const logs = yield activityLogRepo.find({
            where: { user: { id: userId } },
            relations: ["user"], // Include related user data
        });
        if (!logs || logs.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No activity logs found for this user.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: `Activity logs for user ${userId} fetched successfully.`,
            data: logs,
        });
    }
    catch (error) {
        console.error("Error in fetching activity logs for user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getActivityLogsByUserId = getActivityLogsByUserId;
// Add a new activity log (only for the logged-in user)
const addActivityLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const activityLogRepo = data_source_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const { userId, activity, activity_time, newAppuserId, email, phone_no, device_id, IMEI, latitude, longitude, } = req.body;
        // Ensure the logged-in user is the same as the user whose activity log is being added
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to add activity log for another user.",
                data: null,
            });
        }
        // Check if the user exists
        const user = yield userRepo.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }
        // Create and save the new activity log
        const newActivityLog = activityLogRepo.create({
            user,
            activity,
            activity_time,
            newAppuserId,
            email,
            phone_no,
            device_id,
            IMEI,
            latitude,
            longitude,
        });
        yield activityLogRepo.save(newActivityLog);
        return res.status(201).json({
            success: true,
            message: "Activity log added successfully.",
            data: newActivityLog,
        });
    }
    catch (error) {
        console.error("Error in adding activity log:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addActivityLog = addActivityLog;
// Update activity log by ID (only for the user who created the log)
const updateActivityLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const activityLogRepo = data_source_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
    try {
        const activityLogId = req.params.id;
        const { activity, activity_time, newAppuserId, email, phone_no, device_id, IMEI, latitude, longitude, } = req.body;
        const activityLog = yield activityLogRepo.findOne({
            where: { id: parseInt(activityLogId) },
            relations: ["user"],
        });
        if (!activityLog) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found.",
                data: null,
            });
        }
        // Ensure the logged-in user is the same as the one who created the activity log
        if (((_a = activityLog.user) === null || _a === void 0 ? void 0 : _a.id) !== ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id)) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized to update this activity log.",
                data: null,
            });
        }
        // Update fields
        activityLog.activity = activity || activityLog.activity;
        activityLog.activity_time = activity_time || activityLog.activity_time;
        activityLog.newAppuserId = newAppuserId || activityLog.newAppuserId;
        activityLog.email = email || activityLog.email;
        activityLog.phone_no = phone_no || activityLog.phone_no;
        activityLog.device_id = device_id || activityLog.device_id;
        activityLog.IMEI = IMEI || activityLog.IMEI;
        activityLog.latitude = latitude || activityLog.latitude;
        activityLog.longitude = longitude || activityLog.longitude;
        yield activityLogRepo.save(activityLog);
        return res.status(200).json({
            success: true,
            message: "Activity log updated successfully.",
            data: activityLog,
        });
    }
    catch (error) {
        console.error("Error in updating activity log:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateActivityLog = updateActivityLog;
// Delete activity log by ID (only for admins)
const deleteActivityLog = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const activityLogRepo = data_source_1.AppDataSource.getRepository(ActivityLog_1.ActivityLog);
    try {
        const activityLogId = req.params.id;
        const activityLog = yield activityLogRepo.findOne({
            where: { id: parseInt(activityLogId) },
        });
        if (!activityLog) {
            return res.status(404).json({
                success: false,
                message: "Activity log not found.",
                data: null,
            });
        }
        yield activityLogRepo.remove(activityLog);
        return res.status(200).json({
            success: true,
            message: "Activity log deleted successfully.",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting activity log:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteActivityLog = deleteActivityLog;
