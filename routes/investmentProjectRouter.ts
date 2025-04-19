import { Router } from "express";
import {
  createInvestmentProject,
  getAllInvestmentProjects,
  getInvestmentProjectById,
  updateInvestmentProject,
  deleteInvestmentProject,
} from "../controllers/InvestmentProjectController";

const router = Router();

// Route to get all investment projects
router.get("/", async (req, res) => {
  try {
    await getAllInvestmentProjects(req, res);
  } catch (error) {
    console.error("Error fetching all investment projects:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to get a single project by ID
router.get("/:id", async (req, res) => {
  try {
    await getInvestmentProjectById(req, res);
  } catch (error) {
    console.error("Error fetching investment project by ID:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to create a new investment project
router.post("/", async (req, res) => {
  try {
    await createInvestmentProject(req, res);
  } catch (error) {
    console.error("Error creating investment project:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to update a project
router.put("/:id", async (req, res) => {
  try {
    await updateInvestmentProject(req, res);
  } catch (error) {
    console.error("Error updating investment project:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to delete a project
router.delete("/:id", async (req, res) => {
  try {
    await deleteInvestmentProject(req, res);
  } catch (error) {
    console.error("Error deleting investment project:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

export default router;
