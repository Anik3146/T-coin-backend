import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { AppInfo } from "../entities/AppInfo";
import { User } from "../entities/User";

// Add or update app information for a specific user
export const addOrUpdateAppInfoForUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const appInfoRepo = AppDataSource.getRepository(AppInfo);
  const userRepo = AppDataSource.getRepository(User);

  try {
    const {
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
    } = req.body;

    // Extract user ID from request params
    const userId = req.params.userId;

    // Find the user and load the associated app_info relation
    const user = await userRepo.findOne({
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

    let appInfo: AppInfo | null = user.app_info || null;

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

      await appInfoRepo.save(appInfo);

      return res.status(200).json({
        success: true,
        message: "App information updated successfully for user.",
        data: appInfo,
      });
    } else {
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

      await appInfoRepo.save(appInfo);

      // Link the new app info to the user
      user.app_info = appInfo;
      await userRepo.save(user);

      return res.status(201).json({
        success: true,
        message: "App information added and linked to user successfully.",
        data: appInfo,
      });
    }
  } catch (error: any) {
    console.error("Error in adding/updating app information for user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
