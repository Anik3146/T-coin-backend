import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { TransactionHistory } from "../entities/TransactionHistory";
import { User } from "../entities/User";

// Get all transaction history
export const getTransactionHistory = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const transactionRepo = AppDataSource.getRepository(TransactionHistory);

  try {
    const transactions = await transactionRepo.find({
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
  } catch (error: any) {
    console.error("Error in fetching transaction history:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Add a new transaction to history
export const addTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const transactionRepo = AppDataSource.getRepository(TransactionHistory);

  try {
    const {
      userId,
      transaction_type,
      amount,
      transaction_date,
      transaction_status,
      description,
    } = req.body;

    // Find the related user
    const user = await AppDataSource.getRepository(User).findOne({
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

    await transactionRepo.save(newTransaction);

    return res.status(201).json({
      success: true,
      message: "Transaction added successfully.",
      data: newTransaction,
    });
  } catch (error: any) {
    console.error("Error in adding transaction:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get a specific transaction by ID
export const getTransactionById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const transactionRepo = AppDataSource.getRepository(TransactionHistory);

  try {
    const transactionId = req.params.id;

    const transaction = await transactionRepo.findOne({
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
  } catch (error: any) {
    console.error("Error in fetching transaction by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Update a transaction in history
export const updateTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const transactionRepo = AppDataSource.getRepository(TransactionHistory);

  try {
    const transactionId = req.params.id;
    const {
      transaction_type,
      amount,
      transaction_date,
      transaction_status,
      description,
    } = req.body;

    const transactionToUpdate = await transactionRepo.findOne({
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

    await transactionRepo.save(transactionToUpdate);

    return res.status(200).json({
      success: true,
      message: "Transaction updated successfully.",
      data: transactionToUpdate,
    });
  } catch (error: any) {
    console.error("Error in updating transaction:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Delete a transaction from history
export const deleteTransaction = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const transactionRepo = AppDataSource.getRepository(TransactionHistory);

  try {
    const transactionId = req.params.id;

    const transactionToDelete = await transactionRepo.findOne({
      where: { id: parseInt(transactionId) },
    });

    if (!transactionToDelete) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
        data: null,
      });
    }

    await transactionRepo.remove(transactionToDelete);

    return res.status(200).json({
      success: true,
      message: "Transaction deleted successfully.",
      data: null,
    });
  } catch (error: any) {
    console.error("Error in deleting transaction:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
