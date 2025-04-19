import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { MFSService } from "../entities/MFSservice";

export const createMFSService = async (req: Request, res: Response) => {
  const { service_name, country } = req.body;

  try {
    const mfsRepo = AppDataSource.getRepository(MFSService);
    const newService = mfsRepo.create({ service_name, country });
    await mfsRepo.save(newService);

    return res.status(201).json({
      success: true,
      message: "MFS service created successfully",
      data: newService,
    });
  } catch (err) {
    console.error("createMFSService error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const getAllMFSServices = async (_req: Request, res: Response) => {
  try {
    const mfsRepo = AppDataSource.getRepository(MFSService);
    const services = await mfsRepo.find();

    return res.status(200).json({
      success: true,
      message: "MFS services fetched successfully",
      data: services,
    });
  } catch (err) {
    console.error("getAllMFSServices error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const getMFSServiceById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const mfsRepo = AppDataSource.getRepository(MFSService);
    const service = await mfsRepo.findOne({ where: { id: parseInt(id) } });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "MFS service not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "MFS service fetched successfully",
      data: service,
    });
  } catch (err) {
    console.error("getMFSServiceById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const updateMFSService = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { service_name, country } = req.body;

  try {
    const mfsRepo = AppDataSource.getRepository(MFSService);
    const service = await mfsRepo.findOne({ where: { id: parseInt(id) } });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "MFS service not found",
        data: null,
      });
    }

    service.service_name = service_name ?? service.service_name;
    service.country = country ?? service.country;

    await mfsRepo.save(service);

    return res.status(200).json({
      success: true,
      message: "MFS service updated successfully",
      data: service,
    });
  } catch (err) {
    console.error("updateMFSService error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const deleteMFSService = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const mfsRepo = AppDataSource.getRepository(MFSService);
    const service = await mfsRepo.findOne({ where: { id: parseInt(id) } });

    if (!service) {
      return res.status(404).json({
        success: false,
        message: "MFS service not found",
        data: null,
      });
    }

    await mfsRepo.remove(service);

    return res.status(200).json({
      success: true,
      message: "MFS service deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("deleteMFSService error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};
