import { Router } from "express";
import {
  getTransactionHistory,
  addTransaction,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from "../controllers/TransactionHistoryController";
import { adminApproveWithdrawal } from "../controllers/UserController";

const router = Router();

// Route to get all transactions
router.get("/", async (req, res) => {
  try {
    await getTransactionHistory(req, res);
  } catch (error) {
    console.error("Error in fetching transaction history:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to add a new transaction
router.post("/add", async (req, res) => {
  try {
    await addTransaction(req, res);
  } catch (error) {
    console.error("Error in adding transaction:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to get a specific transaction by ID
router.get("/:id", async (req, res) => {
  try {
    await getTransactionById(req, res);
  } catch (error) {
    console.error("Error in fetching transaction by ID:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to update a transaction
router.put("/:id", async (req, res) => {
  try {
    await updateTransaction(req, res);
  } catch (error) {
    console.error("Error in updating transaction:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    await deleteTransaction(req, res);
  } catch (error) {
    console.error("Error in deleting transaction:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// **New Route** for admin to approve a withdrawal and update user balance
router.put(
  "/admin/withdrawal/:transactionId/approve",
  // authenticateToken, // Authentication middleware for admin
  async (req: any, res: any) => {
    try {
      const { transactionId } = req.params;

      // You can add additional checks here for verifying if the user is an admin, etc.
      // For example, if you're using JWT or roles, you can check the user's role:
      // if (!req.user || req.user.role !== "admin") {
      //   return res.status(403).json({ message: "Admin access required." });
      // }

      // Call the function to approve the withdrawal and update the user's balance
      await adminApproveWithdrawal(req, res); // Calls the function to approve the withdrawal and update user balance
    } catch (error) {
      console.error("Error in approving withdrawal:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred while approving the withdrawal.",
      });
    }
  }
);

export default router;
