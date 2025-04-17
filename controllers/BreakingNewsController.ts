// controllers/breakingNewsController.ts
import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { BreakingNews } from "../entities/BreakingNews";

// Create breaking news
export const createBreakingNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { title, content, active_status } = req.body;

  try {
    const breakingNewsRepo = AppDataSource.getRepository(BreakingNews);

    const breakingNews = new BreakingNews();
    breakingNews.title = title;
    breakingNews.content = content;
    breakingNews.active_status = active_status ?? true; // default to true if not provided

    await breakingNewsRepo.save(breakingNews);

    return res.status(201).json({
      success: true,
      message: "Breaking news created successfully",
      data: breakingNews,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};

// Get all breaking news
export const getAllBreakingNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const breakingNewsRepo = AppDataSource.getRepository(BreakingNews);

    const newsList = await breakingNewsRepo.find({
      order: { publishedAt: "DESC" },
    });

    return res.status(200).json({
      success: true,
      message: "Breaking news fetched successfully",
      data: newsList,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};

// Update breaking news
export const updateBreakingNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { title, content, active_status } = req.body;

  try {
    const breakingNewsRepo = AppDataSource.getRepository(BreakingNews);
    const breakingNews = await breakingNewsRepo.findOneBy({ id: parseInt(id) });

    if (!breakingNews) {
      return res.status(404).json({
        success: false,
        message: "Breaking news not found",
        data: null,
      });
    }

    breakingNews.title = title ?? breakingNews.title;
    breakingNews.content = content ?? breakingNews.content;
    breakingNews.active_status = active_status ?? breakingNews.active_status;

    await breakingNewsRepo.save(breakingNews);

    return res.status(200).json({
      success: true,
      message: "Breaking news updated successfully",
      data: breakingNews,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};

// Delete breaking news
export const deleteBreakingNews = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  try {
    const breakingNewsRepo = AppDataSource.getRepository(BreakingNews);
    const breakingNews = await breakingNewsRepo.findOneBy({ id: parseInt(id) });

    if (!breakingNews) {
      return res.status(404).json({
        success: false,
        message: "Breaking news not found",
        data: null,
      });
    }

    await breakingNewsRepo.remove(breakingNews);

    return res.status(200).json({
      success: true,
      message: "Breaking news deleted successfully",
      data: null,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};
