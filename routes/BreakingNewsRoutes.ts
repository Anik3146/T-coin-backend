import { Router } from "express";
import {
  createBreakingNews,
  getAllBreakingNews,
  updateBreakingNews,
  deleteBreakingNews,
} from "../controllers/BreakingNewsController";

const router = Router();

// Route to create breaking news
router.post("/", async (req, res) => {
  try {
    await createBreakingNews(req, res);
  } catch (error) {
    console.error("Error in creating breaking news:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to get all breaking news
router.get("/", async (req, res) => {
  try {
    await getAllBreakingNews(req, res);
  } catch (error) {
    console.error("Error in fetching breaking news:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to update breaking news
router.put("/:id", async (req, res) => {
  try {
    await updateBreakingNews(req, res);
  } catch (error) {
    console.error("Error in updating breaking news:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to delete breaking news
router.delete("/:id", async (req, res) => {
  try {
    await deleteBreakingNews(req, res);
  } catch (error) {
    console.error("Error in deleting breaking news:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

export default router;
