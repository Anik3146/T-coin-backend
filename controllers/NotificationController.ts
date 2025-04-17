import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Notification } from "../entities/Notifications";
import { User } from "../entities/User";
import admin from "../middleware/firebase";

// Ensure Firebase Admin SDK is initialized, if not already
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

// Helper function to send push notifications
const sendPushNotification = async (
  deviceToken: string,
  title: string,
  body: string
) => {
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
    await admin.messaging().send(messagePayload);
    console.log(`Push notification sent to device: ${deviceToken}`);
  } catch (err) {
    console.error(
      `Failed to send push notification to device ${deviceToken}:`,
      err
    );
  }
};

// Route to update device token for a user
export const updateDeviceToken = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { id: Number(userId) } });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.deviceToken = token;
    await userRepo.save(user);

    return res.status(200).json({
      success: true,
      message: "Device token updated successfully",
    });
  } catch (error) {
    console.error("Error updating device token:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
    });
  }
};

// Create a notification and send push notification if token exists
export const createNotification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId, message } = req.body;

  try {
    // Get the User and Notification repositories from the data source
    const userRepo = AppDataSource.getRepository(User);
    const notificationRepo = AppDataSource.getRepository(Notification);

    // Fetch the user
    const user = await userRepo.findOne({ where: { id: userId } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Create a new notification
    const notification = new Notification();
    notification.user = user;
    notification.message = message;
    notification.date = new Date();

    // Save the notification
    await notificationRepo.save(notification);

    // Send push notification if deviceToken exists
    if (user.deviceToken) {
      await sendPushNotification(
        user.deviceToken,
        "🔔 New Notification",
        message
      );
    }

    return res.status(201).json({
      success: true,
      message: "Notification sent successfully",
      data: notification, // Return the created notification
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};

// Get all notifications for a user
export const getUserNotifications = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { userId } = req.params;

  try {
    // Get the User repository from the data source
    const userRepo = AppDataSource.getRepository(User);

    // Fetch the user along with their notifications
    const user = await userRepo.findOne({
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
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};

// Broadcast a notification to all users
export const broadcastNotification = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({
      success: false,
      message: "Message is required",
      data: null,
    });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const notificationRepo = AppDataSource.getRepository(Notification);

    // Fetch all users
    const users = await userRepo.find();

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No users found to send notifications",
        data: null,
      });
    }

    // Create notifications
    const notifications = users.map((user) => {
      const notification = new Notification();
      notification.user = user;
      notification.message = message;
      notification.date = new Date();
      return notification;
    });

    // Save all notifications
    await notificationRepo.save(notifications);

    // Send push notifications
    const fcmMessages = users
      .filter(
        (user) =>
          typeof user.deviceToken === "string" && user.deviceToken.trim() !== ""
      )
      .map((user) => ({
        token: user.deviceToken as string, // now guaranteed to be string
        notification: {
          title: "🔔 New Broadcast Notification",
          body: message,
        },
        data: {
          type: "broadcast",
        },
      }));

    // Send all push notifications in parallel
    const responses = await Promise.allSettled(
      fcmMessages.map((msg) => admin.messaging().send(msg))
    );

    const successCount = responses.filter(
      (r) => r.status === "fulfilled"
    ).length;

    return res.status(201).json({
      success: true,
      message: `Notification sent to ${users.length} user(s) (${successCount} push notifications delivered)`,
      data: notifications,
    });
  } catch (error: any) {
    console.error("Broadcast Error:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};
