import { Router } from "express";
import {
  createMFSService,
  getAllMFSServices,
  getMFSServiceById,
  updateMFSService,
  deleteMFSService,
} from "../controllers/MFSServiceController";

const router = Router();

// Get all MFS services
router.get("/", async (req, res) => {
  try {
    await getAllMFSServices(req, res);
  } catch (error) {
    console.error("Error fetching MFS services:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Get a single MFS service by ID
router.get("/:id", async (req, res) => {
  try {
    await getMFSServiceById(req, res);
  } catch (error) {
    console.error("Error fetching MFS service by ID:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Create a new MFS service
router.post("/", async (req, res) => {
  try {
    await createMFSService(req, res);
  } catch (error) {
    console.error("Error creating MFS service:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Update an existing MFS service
router.put("/:id", async (req, res) => {
  try {
    await updateMFSService(req, res);
  } catch (error) {
    console.error("Error updating MFS service:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Delete an MFS service
router.delete("/:id", async (req, res) => {
  try {
    await deleteMFSService(req, res);
  } catch (error) {
    console.error("Error deleting MFS service:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

export default router;
