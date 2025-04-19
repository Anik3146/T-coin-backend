import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // Adjust based on your data source
import { InvestmentProject } from "../entities/InvestmentProject"; // Adjust path based on where the InvestmentProject entity is located

// Create a new investment project
export const createInvestmentProject = async (req: Request, res: Response) => {
  const { title, description, total_needed, is_open } = req.body;

  try {
    const projectRepo = AppDataSource.getRepository(InvestmentProject);

    const project = projectRepo.create({
      title,
      description,
      total_needed,
      is_open,
    });

    await projectRepo.save(project);

    return res.status(201).json({
      success: true,
      message: "Investment project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("createInvestmentProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all investment projects
export const getAllInvestmentProjects = async (req: Request, res: Response) => {
  try {
    const projectRepo = AppDataSource.getRepository(InvestmentProject);
    const projects = await projectRepo.find();

    return res.status(200).json({
      success: true,
      message: "Investment projects fetched successfully",
      data: projects,
    });
  } catch (err) {
    console.error("getAllInvestmentProjects error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get a specific investment project by ID
export const getInvestmentProjectById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const projectRepo = AppDataSource.getRepository(InvestmentProject);
    const project = await projectRepo.findOne({ where: { id: parseInt(id) } });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Investment project not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Investment project fetched successfully",
      data: project,
    });
  } catch (err) {
    console.error("getInvestmentProjectById error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Update an investment project by ID
export const updateInvestmentProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { title, description, total_needed, is_open } = req.body;

  try {
    const projectRepo = AppDataSource.getRepository(InvestmentProject);
    let project = await projectRepo.findOne({ where: { id: parseInt(id) } });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Investment project not found",
      });
    }

    project.title = title ?? project.title;
    project.description = description ?? project.description;
    project.total_needed = total_needed ?? project.total_needed;
    project.is_open = is_open ?? project.is_open;

    await projectRepo.save(project);

    return res.status(200).json({
      success: true,
      message: "Investment project updated successfully",
      data: project,
    });
  } catch (err) {
    console.error("updateInvestmentProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete an investment project by ID
export const deleteInvestmentProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const projectRepo = AppDataSource.getRepository(InvestmentProject);
    const project = await projectRepo.findOne({ where: { id: parseInt(id) } });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: "Investment project not found",
      });
    }

    await projectRepo.remove(project);

    return res.status(200).json({
      success: true,
      message: "Investment project deleted successfully",
    });
  } catch (err) {
    console.error("deleteInvestmentProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
