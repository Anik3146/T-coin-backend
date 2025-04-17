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
// src/routes/notificationRoutes.ts
const express_1 = require("express");
const NotificationController_1 = require("../controllers/NotificationController");
const router = (0, express_1.Router)();
// Route to create a new notification
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, NotificationController_1.createNotification)(req, res); // Call your controller function
    }
    catch (error) {
        console.error("Error in creating notification:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to get all notifications for a specific user
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, NotificationController_1.getUserNotifications)(req, res); // Call your controller function
    }
    catch (error) {
        console.error("Error in fetching notifications for user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to broadcast a notification to all users
router.post("/broadcast", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, NotificationController_1.broadcastNotification)(req, res);
    }
    catch (error) {
        console.error("Error in broadcasting notification:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to update a user's device token
router.put("/:userId/device-token", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, NotificationController_1.updateDeviceToken)(req, res);
    }
    catch (error) {
        console.error("Error updating device token:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
exports.default = router;
