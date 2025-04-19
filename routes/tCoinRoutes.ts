import { Router } from "express";
import {
  createTcoinRate,
  getAllTcoinRates,
  getTcoinRateById,
  updateTcoinRate,
  deleteTcoinRate,
} from "../controllers/tCoinController";

const router = Router();

// Get all Tcoin rates
router.get("/", async (req, res) => {
  try {
    await getAllTcoinRates(req, res);
  } catch (error) {
    console.error("Error fetching T-Coin rates:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Get rate by ID
router.get("/:id", async (req, res) => {
  try {
    await getTcoinRateById(req, res);
  } catch (error) {
    console.error("Error fetching T-Coin rate by ID:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Create new rate
router.post("/", async (req, res) => {
  try {
    await createTcoinRate(req, res);
  } catch (error) {
    console.error("Error creating T-Coin rate:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Update rate
router.put("/:id", async (req, res) => {
  try {
    await updateTcoinRate(req, res);
  } catch (error) {
    console.error("Error updating T-Coin rate:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Delete rate
router.delete("/:id", async (req, res) => {
  try {
    await deleteTcoinRate(req, res);
  } catch (error) {
    console.error("Error deleting T-Coin rate:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

export default router;
