"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const TransactionHistoryController_1 = require("../controllers/TransactionHistoryController");
const UserController_1 = require("../controllers/UserController");
const router = (0, express_1.Router)();
// Route to get all transactions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, TransactionHistoryController_1.getTransactionHistory)(req, res);
    }
    catch (error) {
        console.error("Error in fetching transaction history:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to add a new transaction
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, TransactionHistoryController_1.addTransaction)(req, res);
    }
    catch (error) {
        console.error("Error in adding transaction:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get a specific transaction by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, TransactionHistoryController_1.getTransactionById)(req, res);
    }
    catch (error) {
        console.error("Error in fetching transaction by ID:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update a transaction
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, TransactionHistoryController_1.updateTransaction)(req, res);
    }
    catch (error) {
        console.error("Error in updating transaction:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete a transaction
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, TransactionHistoryController_1.deleteTransaction)(req, res);
    }
    catch (error) {
        console.error("Error in deleting transaction:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// **New Route** for admin to approve a withdrawal and update user balance
router.put("/admin/withdrawal/:transactionId/approve", 
// authenticateToken, // Authentication middleware for admin
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { transactionId } = req.params;
        // You can add additional checks here for verifying if the user is an admin, etc.
        // For example, if you're using JWT or roles, you can check the user's role:
        // if (!req.user || req.user.role !== "admin") {
        //   return res.status(403).json({ message: "Admin access required." });
        // }
        // Call the function to approve the withdrawal and update the user's balance
        yield (0, UserController_1.adminApproveWithdrawal)(req, res); // Calls the function to approve the withdrawal and update user balance
    }
    catch (error) {
        console.error("Error in approving withdrawal:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while approving the withdrawal.",
        });
    }
}));
exports.default = router;
