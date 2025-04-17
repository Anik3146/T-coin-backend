import { Router } from "express";
import {
  getAllActivityLogs,
  getActivityLogsByUserId,
  addActivityLog,
  updateActivityLog,
  deleteActivityLog,
} from "../controllers/ActivityLogController";

const router = Router();

// Route to get all activity logs
router.get("/all", async (req, res) => {
  try {
    await getAllActivityLogs(req, res);
  } catch (error) {
    console.error("Error in fetching activity logs:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to get activity logs by user ID
router.get("/:userId", async (req, res) => {
  try {
    await getActivityLogsByUserId(req, res);
  } catch (error) {
    console.error("Error in fetching activity logs for user:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to add a new activity log
router.post("/add", async (req, res) => {
  try {
    await addActivityLog(req, res);
  } catch (error) {
    console.error("Error in adding activity log:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to update activity log by ID
router.put("/update/:id", async (req, res) => {
  try {
    await updateActivityLog(req, res);
  } catch (error) {
    console.error("Error in updating activity log:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to delete activity log by ID
router.delete("/delete/:id", async (req, res) => {
  try {
    await deleteActivityLog(req, res);
  } catch (error) {
    console.error("Error in deleting activity log:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

export default router;
