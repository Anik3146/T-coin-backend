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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.broadcastNotification = exports.getUserNotifications = exports.createNotification = exports.updateDeviceToken = void 0;
const data_source_1 = require("../data-source");
const Notifications_1 = require("../entities/Notifications");
const User_1 = require("../entities/User");
const firebase_1 = __importDefault(require("../middleware/firebase"));
// Ensure Firebase Admin SDK is initialized, if not already
if (!firebase_1.default.apps.length) {
    firebase_1.default.initializeApp({
        credential: firebase_1.default.credential.applicationDefault(),
    });
}
// Helper function to send push notifications
const sendPushNotification = (deviceToken, title, body) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const messagePayload = {
            token: deviceToken,
            notification: {
                title: title,
                body: body,
            },
            data: {
                type: "notification", // Custom data for frontend
            },
        };
        yield firebase_1.default.messaging().send(messagePayload);
        console.log(`Push notification sent to device: ${deviceToken}`);
    }
    catch (err) {
        console.error(`Failed to send push notification to device ${deviceToken}:`, err);
    }
});
// Route to update device token for a user
const updateDeviceToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    const { token } = req.body;
    // Validate the token format
    if (!token || typeof token !== "string" || token.length < 100) {
        return res.status(400).json({
            success: false,
            message: "Invalid device token",
        });
    }
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({ where: { id: Number(userId) } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        user.deviceToken = token;
        yield userRepo.save(user);
        return res.status(200).json({
            success: true,
            message: "Device token updated successfully",
        });
    }
    catch (error) {
        console.error("Error updating device token:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
        });
    }
});
exports.updateDeviceToken = updateDeviceToken;
// Create a notification and send push notification if token exists
const createNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, message } = req.body;
    try {
        // Get the User and Notification repositories from the data source
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const notificationRepo = data_source_1.AppDataSource.getRepository(Notifications_1.Notification);
        // Fetch the user
        const user = yield userRepo.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        // Create a new notification
        const notification = new Notifications_1.Notification();
        notification.user = user;
        notification.message = message;
        notification.date = new Date();
        // Save the notification
        yield notificationRepo.save(notification);
        // Send push notification if deviceToken exists
        if (user.deviceToken) {
            yield sendPushNotification(user.deviceToken, "🔔 New Notification", message);
        }
        return res.status(201).json({
            success: true,
            message: "Notification sent successfully",
            data: notification, // Return the created notification
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.createNotification = createNotification;
// Get all notifications for a user
const getUserNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        // Get the User repository from the data source
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        // Fetch the user along with their notifications
        const user = yield userRepo.findOne({
            where: { id: Number(userId) },
            relations: ["notifications"], // This will load the notifications for the user
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Notifications fetched successfully",
            data: user.notifications, // Return the list of notifications
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.getUserNotifications = getUserNotifications;
// Broadcast a notification to all users
const broadcastNotification = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { message } = req.body;
    if (!message) {
        return res.status(400).json({
            success: false,
            message: "Message is required",
            data: null,
        });
    }
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const notificationRepo = data_source_1.AppDataSource.getRepository(Notifications_1.Notification);
        // Fetch all users
        const users = yield userRepo.find();
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No users found to send notifications",
                data: null,
            });
        }
        // Create notifications
        const notifications = users.map((user) => {
            const notification = new Notifications_1.Notification();
            notification.user = user;
            notification.message = message;
            notification.date = new Date();
            return notification;
        });
        // Save all notifications
        yield notificationRepo.save(notifications);
        // Send push notifications
        const fcmMessages = users
            .filter((user) => typeof user.deviceToken === "string" && user.deviceToken.trim() !== "")
            .map((user) => ({
            token: user.deviceToken, // now guaranteed to be string
            notification: {
                title: "🔔 New Broadcast Notification",
                body: message,
            },
            data: {
                type: "broadcast",
            },
        }));
        // Send all push notifications in parallel
        const responses = yield Promise.allSettled(fcmMessages.map((msg) => firebase_1.default.messaging().send(msg)));
        const successCount = responses.filter((r) => r.status === "fulfilled").length;
        return res.status(201).json({
            success: true,
            message: `Notification sent to ${users.length} user(s) (${successCount} push notifications delivered)`,
            data: notifications,
        });
    }
    catch (error) {
        console.error("Broadcast Error:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.broadcastNotification = broadcastNotification;
