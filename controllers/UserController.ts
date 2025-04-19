import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { authenticateToken } from "../middleware/Authentication";
import { Notification } from "../entities/Notifications";
import { TransactionHistory } from "../entities/TransactionHistory";
import baseUrl from "../utils/constant";
import { v4 as uuidv4 } from "uuid"; // For generating a unique user code
import * as QRCode from "qrcode";
import path from "path";
import fs from "fs";

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Replace with a strong secret key

// Generate JWT token
// const generateToken = (userId: number) => {
//   return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
// };

// Remove expiresIn to create a token that doesn't expire (not recommended for production)
const generateToken = (userId: number, role: string = "user") => {
  return jwt.sign({ id: userId, role }, JWT_SECRET); // No expiresIn
};

//sign in
export const signIn = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, pin_number } = req.body;

  if (!email || !pin_number) {
    return res
      .status(400)
      .json({ message: "Email and pin number are required" });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check password
    if (pin_number && user.pin_number && typeof pin_number === "string") {
      const isPasswordValid = await bcrypt.compare(pin_number, user.pin_number);

      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid pin_number" });
      }
    } else {
      return res.status(400).json({ message: "Invalid pin_number" });
    }

    const token = generateToken(user.id);

    // Remove password
    const { pin_number: _, ...userWithoutPassword } = user;

    // Add full image URL (if available)
    const imageUrl = user.image ? `${baseUrl}/uploads/${user.image}` : null;

    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        user: {
          ...userWithoutPassword,
          image: imageUrl, // ✅ Return full URL here
        },
      },
    });
  } catch (error) {
    console.error("Error in signing in user:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

//otp for forgot password
export const forgotPassword = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  try {
    // Assuming you have a User repository and you are checking if the user exists in the database
    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Validate OTP (in a real scenario, OTP should be validated dynamically)
    if (otp !== "1234") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Here you would typically send the user a link to reset their password
    // or generate a temporary password reset token for the user.

    // For this example, we will return a success response to simulate that the OTP was validated successfully
    return res.status(200).json({
      success: true,
      message: "OTP validated successfully, you can now reset your password",
    });
  } catch (error) {
    console.error("Error in processing forgot password request:", error);
    return res.status(500).json({ message: "An unexpected error occurred" });
  }
};

// Create a new user
export const createUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userRepo = AppDataSource.getRepository(User);

  const {
    full_name,
    pin_number,
    email,
    phone_no,
    birth_date,
    accepted_terms,
    accepted_terms_time,
    nid_card_number,
  } = req.body;

  // Validate the request body
  if (!full_name || !pin_number || !email || !phone_no) {
    return res.status(400).json({ message: "Required fields are missing." });
  }

  try {
    // Check if email or phone_no already exists
    const existingUser = await userRepo.findOne({
      where: [{ email }, { phone_no }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email or phone number already in use.",
      });
    }

    const hashedPassword = await bcrypt.hash(pin_number, 10);

    // Create a new user object
    const newUser = new User();
    newUser.full_name = full_name;
    newUser.pin_number = hashedPassword;
    newUser.email = email;
    newUser.phone_no = phone_no;
    newUser.birth_date = new Date(birth_date);
    newUser.accepted_terms = accepted_terms ?? false;
    newUser.accepted_terms_time = new Date(accepted_terms_time);

    // Generate a unique user code (UUID)
    newUser.user_code = uuidv4(); // Unique user code

    // Handle NID card details
    if (nid_card_number) newUser.nid_card_number = nid_card_number;

    // Handle uploaded images
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      // Handle uploaded images with unique filenames
      if (req.files) {
        const files = req.files as {
          [fieldname: string]: Express.Multer.File[];
        };

        if (files["image"]) {
          const imageFile = files["image"][0];
          const imageName = `${Date.now()}-image-${imageFile.originalname}`;
          newUser.image = `${baseUrl}/uploads/${imageName}`;
          // Rename the uploaded image to ensure uniqueness
          fs.renameSync(
            imageFile.path,
            path.join(imageFile.destination, imageName)
          );
        }

        if (files["nid_card_front"]) {
          const nidFrontPicFile = files["nid_card_front"][0];
          const nidFrontName = `${Date.now()}-nid_front-${
            nidFrontPicFile.originalname
          }`;
          newUser.nid_card_front_pic_url = `${baseUrl}/uploads/${nidFrontName}`;
          // Rename the uploaded image to ensure uniqueness
          fs.renameSync(
            nidFrontPicFile.path,
            path.join(nidFrontPicFile.destination, nidFrontName)
          );
        }

        if (files["nid_card_back"]) {
          const nidBackPicFile = files["nid_card_back"][0];
          const nidBackName = `${Date.now()}-nid_back-${
            nidBackPicFile.originalname
          }`;
          newUser.nid_card_back_pic_url = `${baseUrl}/uploads/${nidBackName}`;
          // Rename the uploaded image to ensure uniqueness
          fs.renameSync(
            nidBackPicFile.path,
            path.join(nidBackPicFile.destination, nidBackName)
          );
        }

        if (files["passport"]) {
          const passportPdfFile = files["passport"][0];
          const passportName = `${Date.now()}-passport-${
            passportPdfFile.originalname
          }`;
          newUser.passport_file_url = `${baseUrl}/uploads/${passportName}`;
          // Rename the uploaded image to ensure uniqueness
          fs.renameSync(
            passportPdfFile.path,
            path.join(passportPdfFile.destination, passportName)
          );
        }
      }
    }

    // Save the user first to ensure the user.id is populated
    await userRepo.save(newUser);

    // Now that the user is saved and `id` is available, generate the QR code URL
    const userUrl = `${baseUrl}/users/${newUser.id}`;

    // Use path.resolve to get the correct root directory
    const uploadsDir = path.resolve(__dirname, "../../uploads"); // Go back 2 directories to reach the root folder

    // Log the uploads directory for debugging purposes
    console.log("Uploads Directory Path:", uploadsDir);

    // Path for saving the QR code image directly in the 'uploads' folder
    const qrCodePath = path.join(uploadsDir, `${newUser.id}-qrcode.png`);

    // Log the QR Code path for debugging purposes
    console.log("QR Code Path:", qrCodePath);

    // Ensure the 'uploads' folder exists
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Generate the QR code and save it to the 'uploads' folder
    await QRCode.toFile(qrCodePath, userUrl);

    // Save the QR code image path to the user's profile (relative path)
    newUser.qr_code = `${baseUrl}/uploads/${newUser.id}-qrcode.png`;

    // Save the user again to the database
    await userRepo.save(newUser);

    // Remove password field before returning
    const { pin_number: _, ...userWithoutPassword } = newUser;

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      data: {
        ...userWithoutPassword,
        qr_code: newUser.qr_code, // The URL to the saved QR code image
      },
    });
  } catch (error) {
    console.error("Error in creating user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

//update a user
export const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    full_name,
    pin_number,
    email,
    phone_no,
    accepted_terms,
    accepted_terms_time,
    city,
    country,
    state,
    zip_code,
    latitude,
    longitude,
    institution_name,
    birth_date,
    address,
    tcoin_balance,
    tcoin_withdrawal,
    deviceToken,
    user_code,
    qr_code,
    passport_file_url,
    nid_card_number,
    nid_card_front_pic_url,
    nid_card_back_pic_url,
  } = req.body;

  // Ensure the user can only update their own profile
  if (!id || parseInt(id) !== req.user?.id) {
    return res.status(400).json({
      success: false,
      message: "You can only update your own profile",
      data: null,
    });
  }

  try {
    const userRepo = AppDataSource.getRepository(User);

    // Find user by ID
    const user = await userRepo.findOne({
      where: { id: parseInt(id) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Update fields if provided
    user.full_name = full_name || user.full_name;
    user.email = email || user.email;
    user.phone_no = phone_no || user.phone_no;
    user.accepted_terms =
      accepted_terms !== undefined ? accepted_terms : user.accepted_terms;
    user.accepted_terms_time = accepted_terms_time
      ? new Date(accepted_terms_time)
      : user.accepted_terms_time;
    user.city = city || user.city;
    user.country = country || user.country;
    user.state = state || user.state;
    user.zip_code = zip_code || user.zip_code;
    user.latitude = latitude || user.latitude;
    user.longitude = longitude || user.longitude;
    user.institution_name = institution_name || user.institution_name;
    user.birth_date = birth_date ? new Date(birth_date) : user.birth_date;
    user.address = address || user.address;
    user.tcoin_balance = tcoin_balance || user.tcoin_balance;
    user.tcoin_withdrawal = tcoin_withdrawal || user.tcoin_withdrawal;
    user.deviceToken = deviceToken || user.deviceToken;
    user.user_code = user_code || user.user_code;
    user.qr_code = qr_code || user.qr_code;
    user.passport_file_url = passport_file_url || user.passport_file_url;
    user.nid_card_number = nid_card_number || user.nid_card_number;
    user.nid_card_front_pic_url =
      nid_card_front_pic_url || user.nid_card_front_pic_url;
    user.nid_card_back_pic_url =
      nid_card_back_pic_url || user.nid_card_back_pic_url;

    // Update password (pin_number) if provided
    if (pin_number) {
      user.pin_number = await bcrypt.hash(pin_number, 10);
    }

    // Handle image upload if new images were sent
    if (req.files) {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };

      // Handle user image upload (delete previous image if exists)
      if (files["image"]) {
        if (user.image) {
          const oldImagePath = path.resolve(
            __dirname,
            `../../uploads/${user.image.split("/").pop()}`
          );
          console.log("Deleting old image:", oldImagePath); // Debug log for old image path
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
            console.log("Old image deleted successfully");
          } else {
            console.log("Old image not found:", oldImagePath); // Debug log if file is not found
          }
        }
        const imageFile = files["image"][0];
        const imageName = `${Date.now()}-image-${imageFile.originalname}`;
        user.image = `${baseUrl}/uploads/${imageName}`;
        // Rename the uploaded image to ensure uniqueness
        fs.renameSync(
          imageFile.path,
          path.join(imageFile.destination, imageName)
        );
      }

      // Handle NID card front image upload (delete previous if exists)
      if (files["nid_card_front"]) {
        if (user.nid_card_front_pic_url) {
          const oldNidFrontPicPath = path.resolve(
            __dirname,
            `../../uploads/${user.nid_card_front_pic_url.split("/").pop()}`
          );
          console.log("Deleting old NID front image:", oldNidFrontPicPath); // Debug log for old NID front image
          if (fs.existsSync(oldNidFrontPicPath)) {
            fs.unlinkSync(oldNidFrontPicPath);
            console.log("Old NID front image deleted successfully");
          } else {
            console.log("Old NID front image not found:", oldNidFrontPicPath); // Debug log if file is not found
          }
        }
        const nidFrontPicFile = files["nid_card_front"][0];
        const nidFrontName = `${Date.now()}-nid_front-${
          nidFrontPicFile.originalname
        }`;
        user.nid_card_front_pic_url = `${baseUrl}/uploads/${nidFrontName}`;
        // Rename the uploaded image to ensure uniqueness
        fs.renameSync(
          nidFrontPicFile.path,
          path.join(nidFrontPicFile.destination, nidFrontName)
        );
      }

      // Handle NID card back image upload (delete previous if exists)
      if (files["nid_card_back"]) {
        if (user.nid_card_back_pic_url) {
          const oldNidBackPicPath = path.resolve(
            __dirname,
            `../../uploads/${user.nid_card_back_pic_url.split("/").pop()}`
          );
          console.log("Deleting old NID back image:", oldNidBackPicPath); // Debug log for old NID back image
          if (fs.existsSync(oldNidBackPicPath)) {
            fs.unlinkSync(oldNidBackPicPath);
            console.log("Old NID back image deleted successfully");
          } else {
            console.log("Old NID back image not found:", oldNidBackPicPath); // Debug log if file is not found
          }
        }
        const nidBackPicFile = files["nid_card_back"][0];
        const nidBackName = `${Date.now()}-nid_back-${
          nidBackPicFile.originalname
        }`;
        user.nid_card_back_pic_url = `${baseUrl}/uploads/${nidBackName}`;
        // Rename the uploaded image to ensure uniqueness
        fs.renameSync(
          nidBackPicFile.path,
          path.join(nidBackPicFile.destination, nidBackName)
        );
      }

      // Handle passport file upload (delete previous if exists)
      if (files["passport"]) {
        if (user.passport_file_url) {
          const oldPassportPath = path.resolve(
            __dirname,
            `../../uploads/${user.passport_file_url.split("/").pop()}`
          );
          console.log("Deleting old passport file:", oldPassportPath); // Debug log for old passport file
          if (fs.existsSync(oldPassportPath)) {
            fs.unlinkSync(oldPassportPath);
            console.log("Old passport file deleted successfully");
          } else {
            console.log("Old passport file not found:", oldPassportPath); // Debug log if file is not found
          }
        }
        const passportPdfFile = files["passport"][0];
        const passportName = `${Date.now()}-passport-${
          passportPdfFile.originalname
        }`;
        user.passport_file_url = `${baseUrl}/uploads/${passportName}`;
        // Rename the uploaded image to ensure uniqueness
        fs.renameSync(
          passportPdfFile.path,
          path.join(passportPdfFile.destination, passportName)
        );
      }
    }

    // Save updated user to the database
    const updatedUser = await userRepo.save(user);

    // Exclude the password field before returning
    const { pin_number: _, ...userWithoutPassword } = updatedUser;

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: {
        ...userWithoutPassword,
        image: updatedUser.image,
        nid_card_front_pic_url: updatedUser.nid_card_front_pic_url,
        nid_card_back_pic_url: updatedUser.nid_card_back_pic_url,
        passport_file_url: updatedUser.passport_file_url,
      },
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred",
      data: null,
    });
  }
};

// Get all users

export const getUsers = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userRepo = AppDataSource.getRepository(User);

  try {
    const users = await userRepo.find();

    // Exclude password and include image URL for each user
    const usersWithoutPassword = users.map((user) => {
      const { pin_number, ...userWithoutPassword } = user; // Remove password
      // Add image URL if available
      const imageUrl = user.image ? `${baseUrl}/uploads/${user.image}` : null;
      return {
        ...userWithoutPassword,
        image: imageUrl, // Add image URL to response
      };
    });

    return res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: usersWithoutPassword, // Send users without passwords
    });
  } catch (error) {
    console.error("Error in fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get user by ID
export const getUserById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userRepo = AppDataSource.getRepository(User);
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Exclude password and generate full image URL
    const { pin_number, ...userWithoutPassword } = user;
    const imageUrl = user.image ? `${baseUrl}/uploads/${user.image}` : null;

    return res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        ...userWithoutPassword, // Return the user without the password
        image: imageUrl, // Include the image URL in the response
      },
    });
  } catch (error) {
    console.error("Error in fetching user by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Delete a user by ID
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const userRepo = AppDataSource.getRepository(User);
  const userId = parseInt(req.params.id, 10);

  try {
    const user = await userRepo.findOneBy({ id: userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    await userRepo.remove(user);
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error in deleting user:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get balance for a specific user
export const getUserBalance = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    const userRepo = AppDataSource.getRepository(User);

    // Ensure the user exists
    const user = await userRepo.findOne({
      where: { id: Number(userId) },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    // Return the user's balance (total prize money received)
    return res.status(200).json({
      success: true,
      message: "User balance fetched successfully.",
      data: {
        balance: user.tcoin_balance || 0, // Handle case if the balance is null
      },
    });
  } catch (error) {
    console.error("Error in fetching user balance:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Mark notification as read by ID

export const markNotificationAsRead = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { notificationId } = req.params; // Extract notificationId from the route parameters
  const { user_id } = req.body;

  try {
    const notificationRepo = AppDataSource.getRepository(Notification);

    // Ensure the notification exists
    const notification = await notificationRepo.findOne({
      where: {
        id: Number(notificationId), // Ensure correct number type
      },
      relations: ["user"],
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: "Notification not found.",
        data: null,
      });
    }

    if (notification.user?.id != user_id) {
      console.log(notification.user?.id, user_id);
      return res.status(404).json({
        success: false,
        message: "User Id is not related to notification",
        data: null,
      });
    }

    // Update the notification's read status to true
    notification.read = true;

    // Save the updated notification to the database
    await notificationRepo.save(notification);

    // Return success response
    return res.status(200).json({
      success: true,
      message: "Notification marked as read successfully.",
      data: notification, // Return the updated notification as part of the response
    });
  } catch (error) {
    console.error("Error in marking notification as read:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while updating notification.",
      data: null,
    });
  }
};

//withdraw request pending by a user
export const withdrawMoney = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { user_id, amount } = req.body; // Extract userId and amount from the request body

  try {
    const userRepo = AppDataSource.getRepository(User);
    const transactionHistoryRepo =
      AppDataSource.getRepository(TransactionHistory);

    // Fetch the user from the database
    const user = await userRepo.findOne({ where: { id: user_id } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    // Check if the user has enough prize money for the withdrawal
    if (user.tcoin_balance && user.tcoin_balance < amount) {
      return res.status(400).json({
        success: false,
        message: "Insufficient funds.",
        data: null,
      });
    }

    // Create the TransactionHistory entry for the withdrawal request
    const transaction = new TransactionHistory();
    transaction.user = user;
    transaction.transaction_type = "Withdrawal";
    transaction.amount = amount;
    transaction.transaction_date = new Date();
    transaction.transaction_status = "Pending"; // Status is "Pending" initially
    transaction.description = "User withdrawal request";

    // Save the transaction history record
    await transactionHistoryRepo.save(transaction);

    return res.status(200).json({
      success: true,
      message: "Withdrawal request created and is pending.",
      data: transaction, // Return the created transaction as part of the response
    });
  } catch (error) {
    console.error("Error in withdrawMoney:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while processing the withdrawal.",
      data: null,
    });
  }
};

//admin approving the transaction
export const adminApproveWithdrawal = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const { transactionId } = req.params; // Extract transactionId from the route parameters

  try {
    const userRepo = AppDataSource.getRepository(User);
    const transactionHistoryRepo =
      AppDataSource.getRepository(TransactionHistory);

    // Fetch the transaction from the database
    const transaction = await transactionHistoryRepo.findOne({
      where: { id: Number(transactionId) }, // Ensure correct number type
      relations: ["user"],
    });

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: "Transaction not found.",
        data: null,
      });
    }

    // Check if the transaction is already completed
    if (transaction.transaction_status === "Completed") {
      return res.status(400).json({
        success: false,
        message: "Transaction is already completed.",
        data: null,
      });
    }

    // Check if the transaction amount is defined
    if (transaction.amount === undefined) {
      return res.status(400).json({
        success: false,
        message: "Transaction amount is not defined.",
        data: null,
      });
    }

    // Fetch the user associated with the transaction
    const user = transaction.user;
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
        data: null,
      });
    }

    // Round both the user's prize money and the withdrawal amount to 2 decimal places to avoid precision issues
    let userPrizeMoney = 0;
    let withdrawalAmount = 0;
    if (user.tcoin_balance)
      userPrizeMoney = Math.round(user.tcoin_balance * 100) / 100;
    withdrawalAmount = Math.round(transaction.amount * 100) / 100;

    // Debug: Check the values after rounding
    console.log("Rounded User's total prize money:", userPrizeMoney);
    console.log("Rounded Requested withdrawal amount:", withdrawalAmount);

    // Ensure the user has enough prize money for the withdrawal
    console.log(
      `Checking if user has enough prize money: ${userPrizeMoney} >= ${withdrawalAmount}`
    );

    if (user.tcoin_balance && userPrizeMoney >= withdrawalAmount) {
      // Adjust the user's total prize money and withdrawal amounts
      user.tcoin_balance -= withdrawalAmount; // Deduct the prize money
      user.tcoin_withdrawal =
        Math.round(user.tcoin_withdrawal || 0) + withdrawalAmount; // Add to withdrawal total

      // Set the transaction status to 'Completed'
      transaction.transaction_status = "Completed";
      transaction.updatedAt = new Date(); // Set updated timestamp
      transaction.createdAt = new Date(); // Set created timestamp

      // Save the updated user and transaction
      await userRepo.save(user);
      await transactionHistoryRepo.save(transaction);

      // Return success response
      return res.status(200).json({
        success: true,
        message: `Withdrawal of ${withdrawalAmount} completed successfully. User balance updated.`,
        data: {
          transactionId: transaction.id,
          withdrawalAmount: withdrawalAmount,
          updatedUserBalance: user.tcoin_balance,
          updatedUserWithdrawalTotal: user.tcoin_withdrawal,
        },
      });
    } else {
      return res.status(400).json({
        success: false,
        message:
          "User does not have enough prize money to complete the withdrawal.",
        data: null,
      });
    }
  } catch (error) {
    console.error("Error in adminApproveWithdrawal:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred while approving the withdrawal.",
      data: null,
    });
  }
};
