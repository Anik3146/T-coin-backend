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
exports.deleteTransaction = exports.updateTransaction = exports.getTransactionById = exports.addTransaction = exports.getTransactionHistory = void 0;
const data_source_1 = require("../data-source");
const TransactionHistory_1 = require("../entities/TransactionHistory");
const User_1 = require("../entities/User");
// Get all transaction history
const getTransactionHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
    try {
        const transactions = yield transactionRepo.find({
            relations: ["user"], // Fetch related user details
        });
        if (!transactions || transactions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No transaction history found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Transaction history fetched successfully.",
            data: transactions,
        });
    }
    catch (error) {
        console.error("Error in fetching transaction history:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getTransactionHistory = getTransactionHistory;
// Add a new transaction to history
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
    try {
        const { userId, transaction_type, amount, transaction_date, transaction_status, description, } = req.body;
        // Find the related user
        const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
            where: { id: userId },
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }
        const newTransaction = transactionRepo.create({
            user,
            transaction_type,
            amount,
            transaction_date,
            transaction_status,
            description,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        yield transactionRepo.save(newTransaction);
        return res.status(201).json({
            success: true,
            message: "Transaction added successfully.",
            data: newTransaction,
        });
    }
    catch (error) {
        console.error("Error in adding transaction:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addTransaction = addTransaction;
// Get a specific transaction by ID
const getTransactionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
    try {
        const transactionId = req.params.id;
        const transaction = yield transactionRepo.findOne({
            where: { id: parseInt(transactionId) },
            relations: ["user"], // Fetch related user details
        });
        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Transaction fetched successfully.",
            data: transaction,
        });
    }
    catch (error) {
        console.error("Error in fetching transaction by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getTransactionById = getTransactionById;
// Update a transaction in history
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
    try {
        const transactionId = req.params.id;
        const { transaction_type, amount, transaction_date, transaction_status, description, } = req.body;
        const transactionToUpdate = yield transactionRepo.findOne({
            where: { id: parseInt(transactionId) },
        });
        if (!transactionToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found.",
                data: null,
            });
        }
        transactionToUpdate.transaction_type =
            transaction_type || transactionToUpdate.transaction_type;
        transactionToUpdate.amount = amount || transactionToUpdate.amount;
        transactionToUpdate.transaction_date =
            transaction_date || transactionToUpdate.transaction_date;
        transactionToUpdate.transaction_status =
            transaction_status || transactionToUpdate.transaction_status;
        transactionToUpdate.description =
            description || transactionToUpdate.description;
        transactionToUpdate.updatedAt = new Date();
        yield transactionRepo.save(transactionToUpdate);
        return res.status(200).json({
            success: true,
            message: "Transaction updated successfully.",
            data: transactionToUpdate,
        });
    }
    catch (error) {
        console.error("Error in updating transaction:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateTransaction = updateTransaction;
// Delete a transaction from history
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
    try {
        const transactionId = req.params.id;
        const transactionToDelete = yield transactionRepo.findOne({
            where: { id: parseInt(transactionId) },
        });
        if (!transactionToDelete) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found.",
                data: null,
            });
        }
        yield transactionRepo.remove(transactionToDelete);
        return res.status(200).json({
            success: true,
            message: "Transaction deleted successfully.",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting transaction:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteTransaction = deleteTransaction;
