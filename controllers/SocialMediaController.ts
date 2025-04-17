import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { SocialMedia } from "../entities/SocialMedia";
import * as path from "path"; // To generate the file path
import baseUrl from "../utils/constant";

// Create a new social media entry
export const createSocialMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const socialMediaRepo = AppDataSource.getRepository(SocialMedia);

  try {
    const { title, Link } = req.body;
    const icon = req.file; // Assuming 'icon' is uploaded as form-data

    if (!icon) {
      return res.status(400).json({
        success: false,
        message: "Icon is required for the social media entry.",
        data: null,
      });
    }

    // Generate the icon URL/path (could be used to access it later)
    const iconPath = `${baseUrl}/uploads/${icon.filename}`;

    // Create the social media entry and save it to the DB
    const newSocialMedia = new SocialMedia();
    newSocialMedia.title = title;
    newSocialMedia.Link = Link;
    newSocialMedia.icon = iconPath; // Save the icon URL/path

    await socialMediaRepo.save(newSocialMedia);

    return res.status(201).json({
      success: true,
      message: "Social Media entry created successfully",
      data: newSocialMedia,
    });
  } catch (error: any) {
    console.error("Error in creating Social Media entry:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get all social media entries
export const getAllSocialMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const socialMediaRepo = AppDataSource.getRepository(SocialMedia);

  try {
    const socialMediaEntries = await socialMediaRepo.find();

    return res.status(200).json({
      success: true,
      message: "Social Media entries fetched successfully",
      data: socialMediaEntries,
    });
  } catch (error: any) {
    console.error("Error in fetching Social Media entries:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get a social media entry by ID
export const getSocialMediaById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const socialMediaRepo = AppDataSource.getRepository(SocialMedia);
  const mediaId = parseInt(req.params.id, 10);

  try {
    if (isNaN(mediaId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Social Media ID format",
        data: null,
      });
    }

    const socialMediaEntry = await socialMediaRepo.findOne({
      where: { id: mediaId },
    });

    if (!socialMediaEntry) {
      return res.status(404).json({
        success: false,
        message: "Social Media entry not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Social Media entry fetched successfully",
      data: socialMediaEntry,
    });
  } catch (error: any) {
    console.error("Error in fetching Social Media entry:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Update a social media entry by ID
export const updateSocialMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const socialMediaRepo = AppDataSource.getRepository(SocialMedia);
  const mediaId = parseInt(req.params.id, 10);

  try {
    if (isNaN(mediaId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Social Media ID format",
        data: null,
      });
    }

    const { title, Link } = req.body;

    const socialMediaEntry = await socialMediaRepo.findOne({
      where: { id: mediaId },
    });

    if (!socialMediaEntry) {
      return res.status(404).json({
        success: false,
        message: "Social Media entry not found",
        data: null,
      });
    }

    socialMediaEntry.title = title || socialMediaEntry.title;
    socialMediaEntry.Link = Link || socialMediaEntry.Link;

    await socialMediaRepo.save(socialMediaEntry);

    return res.status(200).json({
      success: true,
      message: "Social Media entry updated successfully",
      data: socialMediaEntry,
    });
  } catch (error: any) {
    console.error("Error in updating Social Media entry:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Delete a social media entry by ID
export const deleteSocialMedia = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const socialMediaRepo = AppDataSource.getRepository(SocialMedia);
  const mediaId = parseInt(req.params.id, 10);

  try {
    if (isNaN(mediaId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Social Media ID format",
        data: null,
      });
    }

    const socialMediaEntry = await socialMediaRepo.findOne({
      where: { id: mediaId },
    });

    if (!socialMediaEntry) {
      return res.status(404).json({
        success: false,
        message: "Social Media entry not found",
        data: null,
      });
    }

    await socialMediaRepo.remove(socialMediaEntry);

    return res.status(200).json({
      success: true,
      message: "Social Media entry deleted successfully",
      data: null,
    });
  } catch (error: any) {
    console.error("Error in deleting Social Media entry:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
