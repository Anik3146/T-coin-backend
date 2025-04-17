// src/routes/notificationRoutes.ts
import { Router } from "express";
import {
  broadcastNotification,
  createNotification,
  getUserNotifications,
  updateDeviceToken,
} from "../controllers/NotificationController";

const router = Router();

// Route to create a new notification
router.post("/", async (req, res) => {
  try {
    await createNotification(req, res); // Call your controller function
  } catch (error) {
    console.error("Error in creating notification:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to get all notifications for a specific user
router.get("/:userId", async (req, res) => {
  try {
    await getUserNotifications(req, res); // Call your controller function
  } catch (error) {
    console.error("Error in fetching notifications for user:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to broadcast a notification to all users
router.post("/broadcast", async (req, res) => {
  try {
    await broadcastNotification(req, res);
  } catch (error) {
    console.error("Error in broadcasting notification:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to update a user's device token
router.put("/:userId/device-token", async (req, res) => {
  try {
    await updateDeviceToken(req, res);
  } catch (error) {
    console.error("Error updating device token:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

export default router;
