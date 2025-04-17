import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { Banners } from "../entities/Banners";
import * as path from "path"; // To generate the file path
import baseUrl from "../utils/constant";

// Create a new banner
export const createBanner = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const bannerRepo = AppDataSource.getRepository(Banners);

  try {
    const { title, description, link, active } = req.body;
    const image = req.file; // Assuming 'image' is uploaded as form-data

    if (!image) {
      return res.status(400).json({
        success: false,
        message: "Image is required for the banner.",
        data: null,
      });
    }

    // Generate the image URL/path (could be used to access it later)
    const imagePath = `${baseUrl}/uploads/${image.filename}`;

    // Create the banner and save it to the DB
    const newBanner = new Banners();
    newBanner.title = title;
    newBanner.description = description;
    newBanner.link = link;
    newBanner.active = active;
    newBanner.image = imagePath; // Save the image URL/path
    newBanner.createdAt = new Date();
    newBanner.updatedAt = new Date();

    await bannerRepo.save(newBanner);

    return res.status(201).json({
      success: true,
      message: "Banner created successfully",
      data: newBanner,
    });
  } catch (error: any) {
    console.error("Error in creating banner:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Update an existing banner
export const updateBanner = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const bannerRepo = AppDataSource.getRepository(Banners);
  const bannerId = req.params.id; // Assuming the ID is passed in the URL

  try {
    const { title, description, link, active } = req.body;
    const image = req.file; // Assuming 'image' is uploaded as form-data

    // Check if the banner exists
    const existingBanner = await bannerRepo.findOne({
      where: { id: parseInt(bannerId) },
    });
    if (!existingBanner) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
        data: null,
      });
    }

    // Update fields if provided
    if (title) existingBanner.title = title;
    if (description) existingBanner.description = description;
    if (link) existingBanner.link = link;
    if (active !== undefined) existingBanner.active = active;

    // If new image is provided, update it
    if (image) {
      const imagePath = `${baseUrl}/uploads/${image.filename}`;
      existingBanner.image = imagePath;
    }

    // Update the timestamp
    existingBanner.updatedAt = new Date();

    // Save updated banner to the DB
    await bannerRepo.save(existingBanner);

    return res.status(200).json({
      success: true,
      message: "Banner updated successfully",
      data: existingBanner,
    });
  } catch (error: any) {
    console.error("Error in updating banner:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Delete a banner
export const deleteBanner = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const bannerRepo = AppDataSource.getRepository(Banners);
  const bannerId = req.params.id; // Assuming the ID is passed in the URL

  try {
    // Find the banner by ID
    const bannerToDelete = await bannerRepo.findOne({
      where: { id: parseInt(bannerId) },
    });
    if (!bannerToDelete) {
      return res.status(404).json({
        success: false,
        message: "Banner not found.",
        data: null,
      });
    }

    // Delete the banner
    await bannerRepo.remove(bannerToDelete);

    return res.status(200).json({
      success: true,
      message: "Banner deleted successfully",
      data: null,
    });
  } catch (error: any) {
    console.error("Error in deleting banner:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
