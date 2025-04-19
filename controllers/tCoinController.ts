import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TcoinRate } from "../entities/TcoinRate";

export const createTcoinRate = async (req: Request, res: Response) => {
  const { from_currency, rate, country } = req.body;

  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);
    const newRate = rateRepo.create({ from_currency, rate, country });
    await rateRepo.save(newRate);

    return res.status(201).json({
      success: true,
      message: "T-Coin rate created successfully",
      data: newRate,
    });
  } catch (err) {
    console.error("createTcoinRate error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const getAllTcoinRates = async (_req: Request, res: Response) => {
  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);
    const rates = await rateRepo.find();

    return res.status(200).json({
      success: true,
      message: "T-Coin rates fetched successfully",
      data: rates,
    });
  } catch (err) {
    console.error("getAllTcoinRates error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const getTcoinRateById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);
    const rate = await rateRepo.findOne({ where: { id: parseInt(id) } });

    if (!rate) {
      return res.status(404).json({
        success: false,
        message: "T-Coin rate not found",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "T-Coin rate fetched successfully",
      data: rate,
    });
  } catch (err) {
    console.error("getTcoinRateById error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const updateTcoinRate = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { from_currency, rate, country } = req.body;

  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);
    const existing = await rateRepo.findOne({ where: { id: parseInt(id) } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "T-Coin rate not found",
        data: null,
      });
    }

    existing.from_currency = from_currency ?? existing.from_currency;
    existing.rate = rate ?? existing.rate;
    existing.country = country ?? existing.country;

    await rateRepo.save(existing);

    return res.status(200).json({
      success: true,
      message: "T-Coin rate updated successfully",
      data: existing,
    });
  } catch (err) {
    console.error("updateTcoinRate error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};

export const deleteTcoinRate = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);
    const existing = await rateRepo.findOne({ where: { id: parseInt(id) } });

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: "T-Coin rate not found",
        data: null,
      });
    }

    await rateRepo.remove(existing);

    return res.status(200).json({
      success: true,
      message: "T-Coin rate deleted successfully",
      data: null,
    });
  } catch (err) {
    console.error("deleteTcoinRate error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
      data: null,
    });
  }
};
