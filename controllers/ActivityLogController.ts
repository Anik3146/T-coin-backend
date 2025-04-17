import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { ActivityLog } from "../entities/ActivityLog";
import { User } from "../entities/User";

// Get all activity logs
export const getAllActivityLogs = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const activityLogRepo = AppDataSource.getRepository(ActivityLog);

  try {
    const logs = await activityLogRepo.find({
      relations: ["user"], // Include related user data
    });

    return res.status(200).json({
      success: true,
      message: "Activity logs fetched successfully.",
      data: logs,
    });
  } catch (error: any) {
    console.error("Error in fetching activity logs:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get activity logs by User ID
export const getActivityLogsByUserId = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const activityLogRepo = AppDataSource.getRepository(ActivityLog);

  try {
    const userId = parseInt(req.params.userId, 10);

    const logs = await activityLogRepo.find({
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
  } catch (error: any) {
    console.error("Error in fetching activity logs for user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Add a new activity log (only for the logged-in user)
export const addActivityLog = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const activityLogRepo = AppDataSource.getRepository(ActivityLog);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const {
      userId,
      activity,
      activity_time,
      newAppuserId,
      email,
      phone_no,
      device_id,
      IMEI,
      latitude,
      longitude,
    } = req.body;

    // Ensure the logged-in user is the same as the user whose activity log is being added
    if (req.user?.id !== userId) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized to add activity log for another user.",
        data: null,
      });
    }

    // Check if the user exists
    const user = await userRepo.findOne({ where: { id: userId } });

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

    await activityLogRepo.save(newActivityLog);

    return res.status(201).json({
      success: true,
      message: "Activity log added successfully.",
      data: newActivityLog,
    });
  } catch (error: any) {
    console.error("Error in adding activity log:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Update activity log by ID (only for the user who created the log)
export const updateActivityLog = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const activityLogRepo = AppDataSource.getRepository(ActivityLog);

  try {
    const activityLogId = req.params.id;
    const {
      activity,
      activity_time,
      newAppuserId,
      email,
      phone_no,
      device_id,
      IMEI,
      latitude,
      longitude,
    } = req.body;

    const activityLog = await activityLogRepo.findOne({
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
    if (activityLog.user?.id !== req.user?.id) {
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

    await activityLogRepo.save(activityLog);

    return res.status(200).json({
      success: true,
      message: "Activity log updated successfully.",
      data: activityLog,
    });
  } catch (error: any) {
    console.error("Error in updating activity log:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Delete activity log by ID (only for admins)
export const deleteActivityLog = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const activityLogRepo = AppDataSource.getRepository(ActivityLog);

  try {
    const activityLogId = req.params.id;

    const activityLog = await activityLogRepo.findOne({
      where: { id: parseInt(activityLogId) },
    });

    if (!activityLog) {
      return res.status(404).json({
        success: false,
        message: "Activity log not found.",
        data: null,
      });
    }

    await activityLogRepo.remove(activityLog);

    return res.status(200).json({
      success: true,
      message: "Activity log deleted successfully.",
      data: null,
    });
  } catch (error: any) {
    console.error("Error in deleting activity log:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
