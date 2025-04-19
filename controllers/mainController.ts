import { AppDataSource } from "../data-source";
import { Admin } from "../entities/Admin";
import { Agent } from "../entities/Agent";
import { Request, Response } from "express";
import { Savings } from "../entities/Savings";
import { User } from "../entities/User";
import { MFSService } from "../entities/MFSservice";
import { TransactionHistory } from "../entities/TransactionHistory";
import { InvestmentProject } from "../entities/InvestmentProject";
import { Investment } from "../entities/Investment";
import { Referral } from "../entities/Referral";
import { TcoinRate } from "../entities/TcoinRate";

//get agents by country (for users)
export const getAgentListByCountry = async (req: Request, res: Response) => {
  const { country } = req.params;

  try {
    const userRepo = AppDataSource.getRepository(Agent);
    const agents = await userRepo.find({ where: { country } });

    if (agents.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No agents found in ${country}`,
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: `Successfully fetched agents for ${country}`,
      data: agents,
    });
  } catch (err) {
    console.error("getAgentListByCountry error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//get admins list (for agents)
export const getAdminList = async (_req: Request, res: Response) => {
  try {
    const adminRepo = AppDataSource.getRepository(Admin);
    const admins = await adminRepo.find();

    if (admins.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No admins found",
        data: [],
      });
    }

    return res.status(200).json({
      success: true,
      message: "Successfully fetched admins",
      data: admins,
    });
  } catch (err) {
    console.error("getAdminList error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//create a savings (user and agent)
export const createSavings = async (req: Request, res: Response) => {
  const { userId, amount, savings_date, type } = req.body;

  if (!userId || !amount || !savings_date || !type) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const savingsRepo = AppDataSource.getRepository(Savings);
    let userEntity;

    // Determine the entity type based on the 'type' field
    if (type === "user") {
      const userRepo = AppDataSource.getRepository(User);
      userEntity = await userRepo.findOne({ where: { id: userId } });
    } else if (type === "admin") {
      const adminRepo = AppDataSource.getRepository(Admin);
      userEntity = await adminRepo.findOne({ where: { id: userId } });
    } else if (type === "agent") {
      const agentRepo = AppDataSource.getRepository(Agent);
      userEntity = await agentRepo.findOne({ where: { id: userId } });
    }

    if (!userEntity) {
      return res.status(404).json({
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
      });
    }

    // Create the savings record using the correct entity
    const saving = savingsRepo.create({
      user: userEntity,
      amount,
      savings_date: new Date(savings_date),
      is_active: true,
    });

    await savingsRepo.save(saving);

    return res.status(201).json({
      success: true,
      message: "Savings created successfully",
      data: saving,
    });
  } catch (err) {
    console.error("createSavings error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create a remittance withdrawal
export const sendRemittance = async (req: Request, res: Response) => {
  const { userId, mfs_service_id, amount, type } = req.body;

  if (!userId || !mfs_service_id || !amount || !type) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    let userEntity;

    // Determine the entity type based on the 'type' field
    if (type === "user") {
      const userRepo = AppDataSource.getRepository(User);
      userEntity = await userRepo.findOne({ where: { id: userId } });
    } else if (type === "admin") {
      const adminRepo = AppDataSource.getRepository(Admin);
      userEntity = await adminRepo.findOne({ where: { id: userId } });
    } else if (type === "agent") {
      const agentRepo = AppDataSource.getRepository(Agent);
      userEntity = await agentRepo.findOne({ where: { id: userId } });
    }

    if (!userEntity)
      return res.status(404).json({
        message: `${type.charAt(0).toUpperCase() + type.slice(1)} not found`,
      });

    const serviceRepo = AppDataSource.getRepository(MFSService);
    const service = await serviceRepo.findOne({
      where: { id: mfs_service_id },
    });

    if (!service)
      return res.status(404).json({ message: "MFS service not found" });

    if ((userEntity.tcoin_balance ?? 0) < amount)
      return res.status(400).json({ message: "Insufficient balance" });

    // Deduct the amount from the user's balance
    userEntity.tcoin_balance = (userEntity.tcoin_balance ?? 0) - amount;

    const txRepo = AppDataSource.getRepository(TransactionHistory);
    const tx = txRepo.create({
      user: userEntity,
      transaction_type: "Remittance",
      amount,
      transaction_status: "Pending",
      description: `To ${service.service_name}`,
      transaction_date: new Date(),
    });

    // Save the updated user balance and transaction
    await AppDataSource.getRepository(
      type.charAt(0).toUpperCase() + type.slice(1)
    ).save(userEntity);
    await txRepo.save(tx);

    return res.status(200).json({
      success: true,
      message: "Remittance initiated successfully",
      data: tx,
    });
  } catch (err) {
    console.error("sendRemittance error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// Create investment project (admin/agent)
export const createInvestmentProject = async (req: Request, res: Response) => {
  const { title, description, total_needed } = req.body;

  if (!title || !description || !total_needed) {
    return res.status(400).json({ message: "Missing fields" });
  }

  try {
    const projectRepo = AppDataSource.getRepository(InvestmentProject);

    // Create a new investment project entity
    const project = projectRepo.create({
      title,
      description,
      total_needed,
      total_invested: 0,
      is_open: true,
    });

    // Save the new project to the database
    await projectRepo.save(project);

    // Return a success message with project data
    return res.status(201).json({
      success: true,
      message: "Investment project created successfully",
      data: project,
    });
  } catch (err) {
    console.error("createInvestmentProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//invest in a project
export const investInProject = async (req: Request, res: Response) => {
  const { userId, projectId, amount, type } = req.body;

  try {
    let userRepo;

    if (type === "agent") {
      userRepo = AppDataSource.getRepository(Agent);
    } else if (type === "admin") {
      userRepo = AppDataSource.getRepository(Admin);
    } else {
      return res.status(400).json({ message: "Invalid user type" });
    }

    const investRepo = AppDataSource.getRepository(Investment);
    const projectRepo = AppDataSource.getRepository(InvestmentProject);

    const user = await userRepo.findOne({ where: { id: userId } });
    const project = await projectRepo.findOne({ where: { id: projectId } });

    if (!user || !project || !project.is_open) {
      return res.status(400).json({ message: "Invalid investment request" });
    }

    if ((user.tcoin_balance ?? 0) < amount) {
      return res.status(400).json({ message: "Insufficient balance" });
    }

    user.tcoin_balance = (user.tcoin_balance ?? 0) - amount;
    project.total_invested += amount;

    const invest = investRepo.create({
      investor: user,
      project,
      amount,
      invested_on: new Date(),
    });

    await userRepo.save(user);
    await projectRepo.save(project);
    await investRepo.save(invest);

    return res.status(201).json({
      success: true,
      data: {
        id: invest.id,
        amount: invest.amount,
        invested_on: invest.invested_on,
        investor: {
          id: user.id,
          type: type,
        },
        project: {
          id: project.id,
          title: project.title,
        },
      },
    });
  } catch (err) {
    console.error("investInProject error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//currency rate controller
export const getCurrencyRates = async (_req: Request, res: Response) => {
  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);
    const rates = await rateRepo.find();

    const formattedRates = rates.map((rate) => ({
      id: rate.id,
      from_currency: rate.from_currency,
      rate: Number(rate.rate),
      country: rate.country,
      createdAt: rate.createdAt,
      updatedAt: rate.updatedAt,
    }));

    return res.status(200).json({
      success: true,
      message: "Currency rates fetched successfully",
      data: formattedRates,
    });
  } catch (err) {
    console.error("getCurrencyRates error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//update currency rate
export const updateCurrencyRate = async (req: Request, res: Response) => {
  const { country, rate, from_currency } = req.body;

  try {
    const rateRepo = AppDataSource.getRepository(TcoinRate);

    let existing = await rateRepo.findOne({ where: { country } });

    let savedRate;

    if (existing) {
      existing.rate = rate;
      if (from_currency) existing.from_currency = from_currency;
      savedRate = await rateRepo.save(existing);
    } else {
      const newRate = rateRepo.create({ country, rate, from_currency });
      savedRate = await rateRepo.save(newRate);
    }

    return res.status(200).json({
      success: true,
      message: "Currency rate updated successfully",
      data: {
        id: savedRate.id,
        from_currency: savedRate.from_currency,
        rate: Number(savedRate.rate),
        country: savedRate.country,
        createdAt: savedRate.createdAt,
        updatedAt: savedRate.updatedAt,
      },
    });
  } catch (err) {
    console.error("updateCurrencyRate error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//referral code entity
export const useReferralCode = async (req: Request, res: Response) => {
  const { code, newUserId, type } = req.body;

  try {
    const referralRepo = AppDataSource.getRepository(Referral);
    const referral = await referralRepo.findOne({
      where: { referral_code: code, is_used: false },
    });

    if (!referral) {
      return res.status(404).json({
        success: false,
        message: "Invalid or already used referral code",
      });
    }

    referral.is_used = true;
    referral.used_by_user_id = newUserId;
    await referralRepo.save(referral);

    // Declare newUser separately to avoid union typing confusion
    let newUser: User | Admin | Agent | null = null;

    if (type === "user") {
      const repo = AppDataSource.getRepository(User);
      newUser = await repo.findOne({ where: { id: newUserId } });
      if (newUser) {
        newUser.tcoin_balance = (newUser.tcoin_balance ?? 0) + 50;
        await repo.save(newUser);
      }
    } else if (type === "admin") {
      const repo = AppDataSource.getRepository(Admin);
      newUser = await repo.findOne({ where: { id: newUserId } });
      if (newUser) {
        newUser.tcoin_balance = (newUser.tcoin_balance ?? 0) + 50;
        await repo.save(newUser);
      }
    } else if (type === "agent") {
      const repo = AppDataSource.getRepository(Agent);
      newUser = await repo.findOne({ where: { id: newUserId } });
      if (newUser) {
        newUser.tcoin_balance = (newUser.tcoin_balance ?? 0) + 50;
        await repo.save(newUser);
      }
    } else {
      return res.status(400).json({
        success: false,
        message: "Invalid user type",
      });
    }

    if (!newUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Referral code applied successfully",
      data: {
        referral_id: referral.id,
        used_by: {
          id: newUser.id,
          type,
        },
        bonus_applied: true,
        new_balance: newUser.tcoin_balance,
      },
    });
  } catch (err) {
    console.error("useReferralCode error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//send money
export const sendTcoin = async (req: Request, res: Response) => {
  const { senderId, receiverId, amount, senderType, receiverType } = req.body;

  try {
    let sender: User | Admin | Agent | null = null;
    let receiver: User | Admin | Agent | null = null;

    // Get sender based on type
    if (senderType === "user") {
      const repo = AppDataSource.getRepository(User);
      sender = await repo.findOne({ where: { id: senderId } });
    } else if (senderType === "admin") {
      const repo = AppDataSource.getRepository(Admin);
      sender = await repo.findOne({ where: { id: senderId } });
    } else if (senderType === "agent") {
      const repo = AppDataSource.getRepository(Agent);
      sender = await repo.findOne({ where: { id: senderId } });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid sender type" });
    }

    // Get receiver based on type
    if (receiverType === "user") {
      const repo = AppDataSource.getRepository(User);
      receiver = await repo.findOne({ where: { id: receiverId } });
    } else if (receiverType === "admin") {
      const repo = AppDataSource.getRepository(Admin);
      receiver = await repo.findOne({ where: { id: receiverId } });
    } else if (receiverType === "agent") {
      const repo = AppDataSource.getRepository(Agent);
      receiver = await repo.findOne({ where: { id: receiverId } });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Invalid receiver type" });
    }

    // Validate users
    if (!sender || !receiver) {
      return res.status(404).json({
        success: false,
        message: "Sender or receiver not found",
      });
    }

    if ((sender.tcoin_balance ?? 0) < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance",
      });
    }

    // Update balances
    sender.tcoin_balance = (sender.tcoin_balance ?? 0) - amount;
    receiver.tcoin_balance = (receiver.tcoin_balance ?? 0) + amount;

    // Save updated sender
    if (senderType === "user") {
      await AppDataSource.getRepository(User).save(sender as User);
    } else if (senderType === "admin") {
      await AppDataSource.getRepository(Admin).save(sender as Admin);
    } else if (senderType === "agent") {
      await AppDataSource.getRepository(Agent).save(sender as Agent);
    }

    // Save updated receiver
    if (receiverType === "user") {
      await AppDataSource.getRepository(User).save(receiver as User);
    } else if (receiverType === "admin") {
      await AppDataSource.getRepository(Admin).save(receiver as Admin);
    } else if (receiverType === "agent") {
      await AppDataSource.getRepository(Agent).save(receiver as Agent);
    }

    // Create transaction log
    const txRepo = AppDataSource.getRepository(TransactionHistory);
    const tx = txRepo.create({
      user: sender,
      transaction_type: "Send Money",
      amount,
      transaction_status: "Completed",
      description: `Sent to ${receiverType} ID ${receiverId}`,
      transaction_date: new Date(),
    });

    await txRepo.save(tx);

    return res.status(200).json({
      success: true,
      message: "T-Coin sent successfully",
      data: {
        transaction_id: tx.id,
        sender: {
          id: sender.id,
          type: senderType,
          new_balance: sender.tcoin_balance,
        },
        receiver: {
          id: receiver.id,
          type: receiverType,
          new_balance: receiver.tcoin_balance,
        },
        amount,
        transaction_date: tx.transaction_date,
      },
    });
  } catch (err) {
    console.error("sendTcoin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

//cash out
export const cashOutTcoin = async (req: Request, res: Response) => {
  const { userId, amount, agentId, userCountry } = req.body;

  try {
    let userRepo, agentRepo, tcoinRateRepo;

    // Repositories
    userRepo = AppDataSource.getRepository(User);
    agentRepo = AppDataSource.getRepository(Agent);
    tcoinRateRepo = AppDataSource.getRepository(TcoinRate);

    // Get the user and agent details
    const user = await userRepo.findOne({ where: { id: userId } });
    const agent = await agentRepo.findOne({ where: { id: agentId } });

    if (!user || !agent) {
      return res
        .status(404)
        .json({ success: false, message: "User or agent not found" });
    }

    // Check if agent belongs to the same country as user
    if (agent.country !== userCountry) {
      return res.status(400).json({
        success: false,
        message: "Agent is not available for this country",
      });
    }

    // Find the currency rate for the user's country
    const rateRecord = await tcoinRateRepo.findOne({
      where: { country: userCountry },
    });

    if (!rateRecord) {
      return res.status(404).json({
        success: false,
        message: "Currency rate for the selected country not found",
      });
    }

    // Ensure the user has sufficient balance
    if ((user.tcoin_balance ?? 0) < amount) {
      return res
        .status(400)
        .json({ success: false, message: "Insufficient balance" });
    }

    // Deduct T-coins from user's balance
    user.tcoin_balance = (user.tcoin_balance ?? 0) - amount;

    // Calculate the amount in the local currency based on the rate
    const localCurrencyAmount = amount * rateRecord.rate;

    // Create transaction record
    const txRepo = AppDataSource.getRepository(TransactionHistory);
    const tx = txRepo.create({
      user,
      transaction_type: "Cash Out",
      amount,
      local_currency_amount: localCurrencyAmount, // Adding the converted currency amount
      transaction_status: "Pending",
      description: `Requested via agent ID ${agentId} in ${userCountry}`,
      transaction_date: new Date(),
    });

    // Save the updated user balance and transaction record
    await userRepo.save(user);
    await txRepo.save(tx);

    return res.status(200).json({
      success: true,
      message: "Cash out request placed successfully",
      data: {
        transaction_id: tx.id,
        user: {
          id: user.id,
          new_balance: user.tcoin_balance,
        },
        amount,
        localCurrencyAmount, // Showing the amount in the local currency
        transaction_status: tx.transaction_status,
      },
    });
  } catch (err) {
    console.error("cashOutTcoin error:", err);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

// Agent to Admin - T-Coin to Money Exchange
export const exchangeAgentTcoinToMoney = async (
  req: Request,
  res: Response
) => {
  const { agentId, adminId, amountInTcoin, agentCountry } = req.body;

  try {
    const agentRepo = AppDataSource.getRepository(Agent); // Assuming Agent is a subclass of User
    const adminRepo = AppDataSource.getRepository(Admin); // Assuming Admin is a subclass of User
    const tcoinRateRepo = AppDataSource.getRepository(TcoinRate);

    // Get agent and admin details
    const agent = await agentRepo.findOne({ where: { id: agentId } });
    const admin = await adminRepo.findOne({ where: { id: adminId } });

    if (!agent || !admin) {
      return res
        .status(404)
        .json({ success: false, message: "Agent or Admin not found" });
    }

    // Get exchange rate for the agent's country
    const rateRecord = await tcoinRateRepo.findOne({
      where: { country: agentCountry },
    });

    if (!rateRecord) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Currency rate for the selected country not found",
        });
    }

    // Ensure agent has enough T-Coins to exchange
    if ((agent.tcoin_balance ?? 0) < amountInTcoin) {
      return res
        .status(400)
        .json({ success: false, message: "Agent has insufficient T-Coins" });
    }

    // Calculate the local currency equivalent of the T-Coins
    const localCurrencyAmount = amountInTcoin * rateRecord.rate;

    // Deduct T-Coins from agent and add local currency to the admin's balance
    agent.tcoin_balance = (agent.tcoin_balance ?? 0) - amountInTcoin;
    admin.local_currency_balance =
      (admin.local_currency_balance ?? 0) + localCurrencyAmount;

    // Create transaction record for T-Coin to Money Exchange
    const txRepo = AppDataSource.getRepository(TransactionHistory);
    const tx = txRepo.create({
      user: agent,
      transaction_type: "T-Coin to Money Exchange (Agent to Admin)",
      amount: amountInTcoin,
      local_currency_amount: localCurrencyAmount,
      transaction_status: "Completed",
      description: `Exchanged T-Coins to local currency for admin ID ${adminId}`,
      transaction_date: new Date(),
    });

    // Save the updated agent and admin balances and transaction
    await agentRepo.save(agent);
    await adminRepo.save(admin);
    await txRepo.save(tx);

    return res.status(200).json({
      success: true,
      message:
        "T-Coin to money exchange (Agent to Admin) completed successfully",
      data: {
        transaction_id: tx.id,
        agent: { id: agent.id, new_tcoin_balance: agent.tcoin_balance },
        admin: {
          id: admin.id,
          new_local_currency_balance: admin.local_currency_balance,
        },
        localCurrencyAmount,
      },
    });
  } catch (err) {
    console.error("exchangeAgentTcoinToMoney error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// Agent to Admin - Money to T-Coin Exchange
export const exchangeAgentMoneyToTcoin = async (
  req: Request,
  res: Response
) => {
  const { agentId, adminId, amountInMoney, agentCountry } = req.body;

  try {
    const agentRepo = AppDataSource.getRepository(Agent); // Assuming Agent is a subclass of User
    const adminRepo = AppDataSource.getRepository(Admin); // Assuming Admin is a subclass of User
    const tcoinRateRepo = AppDataSource.getRepository(TcoinRate);

    // Get agent and admin details
    const agent = await agentRepo.findOne({ where: { id: agentId } });
    const admin = await adminRepo.findOne({ where: { id: adminId } });

    if (!agent || !admin) {
      return res
        .status(404)
        .json({ success: false, message: "Agent or Admin not found" });
    }

    // Get exchange rate for the agent's country
    const rateRecord = await tcoinRateRepo.findOne({
      where: { country: agentCountry },
    });

    if (!rateRecord) {
      return res
        .status(404)
        .json({
          success: false,
          message: "Currency rate for the selected country not found",
        });
    }

    // Ensure admin has enough local currency to exchange
    if ((admin.local_currency_balance ?? 0) < amountInMoney) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Admin has insufficient local currency",
        });
    }

    // Calculate the T-Coins equivalent of the local currency
    const tcoinAmount = amountInMoney / rateRecord.rate;

    // Deduct local currency from admin and add T-Coins to the agent
    admin.local_currency_balance =
      (admin.local_currency_balance ?? 0) - amountInMoney;
    agent.tcoin_balance = (agent.tcoin_balance ?? 0) + tcoinAmount;

    // Create transaction record for Money to T-Coin Exchange
    const txRepo = AppDataSource.getRepository(TransactionHistory);
    const tx = txRepo.create({
      user: admin,
      transaction_type: "Money to T-Coin Exchange (Admin to Agent)",
      amount: tcoinAmount,
      transaction_status: "Completed",
      description: `Exchanged money to T-Coins for agent ID ${agentId}`,
      transaction_date: new Date(),
    });

    // Save the updated admin and agent balances and transaction
    await adminRepo.save(admin);
    await agentRepo.save(agent);
    await txRepo.save(tx);

    return res.status(200).json({
      success: true,
      message:
        "Money to T-Coin exchange (Admin to Agent) completed successfully",
      data: {
        transaction_id: tx.id,
        agent: { id: agent.id, new_tcoin_balance: agent.tcoin_balance },
        admin: {
          id: admin.id,
          new_local_currency_balance: admin.local_currency_balance,
        },
        tcoinAmount,
      },
    });
  } catch (err) {
    console.error("exchangeAgentMoneyToTcoin error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
