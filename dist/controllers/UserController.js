"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminApproveWithdrawal = exports.withdrawMoney = exports.markNotificationAsRead = exports.getUserBalance = exports.deleteUser = exports.getUserById = exports.getUsers = exports.updateUser = exports.createUser = exports.forgotPassword = exports.signIn = void 0;
const data_source_1 = require("../data-source");
const User_1 = require("../entities/User");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Notifications_1 = require("../entities/Notifications");
const TransactionHistory_1 = require("../entities/TransactionHistory");
const constant_1 = __importDefault(require("../utils/constant"));
const uuid_1 = require("uuid"); // For generating a unique user code
const QRCode = __importStar(require("qrcode"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key"; // Replace with a strong secret key
// Generate JWT token
// const generateToken = (userId: number) => {
//   return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
// };
// Remove expiresIn to create a token that doesn't expire (not recommended for production)
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ id: userId }, JWT_SECRET); // No expiresIn
};
//sign in
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
    }
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        // Check password
        if (password && user.pin_number && typeof password === "string") {
            const isPasswordValid = yield bcryptjs_1.default.compare(password, user.pin_number);
            if (!isPasswordValid) {
                return res.status(401).json({ message: "Invalid password" });
            }
        }
        else {
            return res.status(400).json({ message: "Invalid password" });
        }
        const token = generateToken(user.id);
        // Remove password
        const { pin_number: _ } = user, userWithoutPassword = __rest(user, ["pin_number"]);
        // Add full image URL (if available)
        const imageUrl = user.image ? `${constant_1.default}/uploads/${user.image}` : null;
        return res.status(200).json({
            success: true,
            message: "Login successful",
            data: {
                token,
                user: Object.assign(Object.assign({}, userWithoutPassword), { image: imageUrl }),
            },
        });
    }
    catch (error) {
        console.error("Error in signing in user:", error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.signIn = signIn;
//otp for forgot password
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: "Email and OTP are required" });
    }
    try {
        // Assuming you have a User repository and you are checking if the user exists in the database
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const user = yield userRepo.findOne({ where: { email } });
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
    }
    catch (error) {
        console.error("Error in processing forgot password request:", error);
        return res.status(500).json({ message: "An unexpected error occurred" });
    }
});
exports.forgotPassword = forgotPassword;
// Create a new user
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const { full_name, pin_number, email, phone_no, birth_date, accepted_terms, accepted_terms_time, nid_card_number, } = req.body;
    // Validate the request body
    if (!full_name || !pin_number || !email || !phone_no) {
        return res.status(400).json({ message: "Required fields are missing." });
    }
    try {
        // Check if email or phone_no already exists
        const existingUser = yield userRepo.findOne({
            where: [{ email }, { phone_no }],
        });
        if (existingUser) {
            return res.status(400).json({
                message: "Email or phone number already in use.",
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(pin_number, 10);
        // Create a new user object
        const newUser = new User_1.User();
        newUser.full_name = full_name;
        newUser.pin_number = hashedPassword;
        newUser.email = email;
        newUser.phone_no = phone_no;
        newUser.birth_date = new Date(birth_date);
        newUser.accepted_terms = accepted_terms !== null && accepted_terms !== void 0 ? accepted_terms : false;
        newUser.accepted_terms_time = new Date(accepted_terms_time);
        // Generate a unique user code (UUID)
        newUser.user_code = (0, uuid_1.v4)(); // Unique user code
        // Handle NID card details
        if (nid_card_number)
            newUser.nid_card_number = nid_card_number;
        // Handle uploaded images
        if (req.files) {
            const files = req.files;
            if (files["image"]) {
                const imageFile = files["image"][0];
                newUser.image = `${constant_1.default}/uploads/${imageFile.filename}`; // Full URL for image
            }
            if (files["nid_card_front"]) {
                const nidFrontPicFile = files["nid_card_front"][0];
                newUser.nid_card_front_pic_url = `${constant_1.default}/uploads/${nidFrontPicFile.filename}`; // Full URL for NID front image
            }
            if (files["nid_card_back"]) {
                const nidBackPicFile = files["nid_card_back"][0];
                newUser.nid_card_back_pic_url = `${constant_1.default}/uploads/${nidBackPicFile.filename}`; // Full URL for NID back image
            }
            if (files["passport"]) {
                const passportPdfFile = files["passport"][0];
                newUser.passport_file_url = `${constant_1.default}/uploads/${passportPdfFile.filename}`; // Full URL for the passport PDF
            }
        }
        // Save the user first to ensure the user.id is populated
        yield userRepo.save(newUser);
        // Now that the user is saved and `id` is available, generate the QR code URL
        const userUrl = `${constant_1.default}/users/${newUser.id}`;
        // Resolve the path to the root folder using path.resolve
        // Use path.resolve to get the correct root directory
        const uploadsDir = path_1.default.resolve(__dirname, "../../uploads"); // Go back 2 directories to reach the root folder
        // Log the uploads directory for debugging purposes
        console.log("Uploads Directory Path:", uploadsDir);
        // Path for saving the QR code image directly in the 'uploads' folder
        const qrCodePath = path_1.default.join(uploadsDir, `${newUser.id}-qrcode.png`);
        // Log the QR Code path for debugging purposes
        console.log("QR Code Path:", qrCodePath);
        // Ensure the 'uploads' folder exists
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        // Generate the QR code and save it to the 'uploads' folder
        yield QRCode.toFile(qrCodePath, userUrl);
        // Save the QR code image path to the user's profile (relative path)
        newUser.qr_code = `${constant_1.default}/uploads/${newUser.id}-qrcode.png`;
        // Save the user again to the database
        yield userRepo.save(newUser);
        // Remove password field before returning
        const { pin_number: _ } = newUser, userWithoutPassword = __rest(newUser, ["pin_number"]);
        return res.status(201).json({
            success: true,
            message: "User created successfully",
            data: Object.assign(Object.assign({}, userWithoutPassword), { qr_code: newUser.qr_code }),
        });
    }
    catch (error) {
        console.error("Error in creating user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.createUser = createUser;
//update a user
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { id } = req.params;
    const { full_name, pin_number, email, phone_no, accepted_terms, accepted_terms_time, city, country, state, zip_code, latitude, longitude, institution_name, birth_date, address, total_prize_money_received, } = req.body;
    if (!id || parseInt(id) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
        return res.status(400).json({
            success: false,
            message: "You can only update your own profile",
            data: null,
        });
    }
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        // Find user by ID
        const user = yield userRepo.findOne({
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
        user.tcoin_balance = total_prize_money_received || user.tcoin_balance;
        // Update password if provided
        if (pin_number) {
            user.pin_number = yield bcryptjs_1.default.hash(pin_number, 10);
        }
        // Handle image upload if a new image was sent
        if (req.file) {
            // Save the full image URL in the database
            user.image = req.file.filename;
        }
        const updatedUser = yield userRepo.save(user);
        // Generate full image URL
        const imagePath = updatedUser.image
            ? `${constant_1.default}/uploads/${updatedUser.image}`
            : null;
        // Exclude password before returning
        const { pin_number: _ } = updatedUser, userWithoutPassword = __rest(updatedUser, ["pin_number"]);
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: Object.assign(Object.assign({}, userWithoutPassword), { image: imagePath }),
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.updateUser = updateUser;
// Get all users
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    try {
        const users = yield userRepo.find();
        // Exclude password and include image URL for each user
        const usersWithoutPassword = users.map((user) => {
            const { pin_number } = user, userWithoutPassword = __rest(user, ["pin_number"]); // Remove password
            // Add image URL if available
            const imageUrl = user.image ? `${constant_1.default}/uploads/${user.image}` : null;
            return Object.assign(Object.assign({}, userWithoutPassword), { image: imageUrl });
        });
        return res.status(200).json({
            success: true,
            message: "Users fetched successfully",
            data: usersWithoutPassword, // Send users without passwords
        });
    }
    catch (error) {
        console.error("Error in fetching users:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getUsers = getUsers;
// Get user by ID
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const userId = parseInt(req.params.id, 10);
    try {
        const user = yield userRepo.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        // Exclude password and generate full image URL
        const { pin_number } = user, userWithoutPassword = __rest(user, ["pin_number"]);
        const imageUrl = user.image ? `${constant_1.default}/uploads/${user.image}` : null;
        return res.status(200).json({
            success: true,
            message: "User fetched successfully",
            data: Object.assign(Object.assign({}, userWithoutPassword), { image: imageUrl }),
        });
    }
    catch (error) {
        console.error("Error in fetching user by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getUserById = getUserById;
// Delete a user by ID
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const userId = parseInt(req.params.id, 10);
    try {
        const user = yield userRepo.findOneBy({ id: userId });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
                data: null,
            });
        }
        yield userRepo.remove(user);
        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteUser = deleteUser;
// Get balance for a specific user
const getUserBalance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params;
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        // Ensure the user exists
        const user = yield userRepo.findOne({
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
    }
    catch (error) {
        console.error("Error in fetching user balance:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getUserBalance = getUserBalance;
// Mark notification as read by ID
const markNotificationAsRead = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { notificationId } = req.params; // Extract notificationId from the route parameters
    const { user_id } = req.body;
    try {
        const notificationRepo = data_source_1.AppDataSource.getRepository(Notifications_1.Notification);
        // Ensure the notification exists
        const notification = yield notificationRepo.findOne({
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
        if (((_a = notification.user) === null || _a === void 0 ? void 0 : _a.id) != user_id) {
            console.log((_b = notification.user) === null || _b === void 0 ? void 0 : _b.id, user_id);
            return res.status(404).json({
                success: false,
                message: "User Id is not related to notification",
                data: null,
            });
        }
        // Update the notification's read status to true
        notification.read = true;
        // Save the updated notification to the database
        yield notificationRepo.save(notification);
        // Return success response
        return res.status(200).json({
            success: true,
            message: "Notification marked as read successfully.",
            data: notification, // Return the updated notification as part of the response
        });
    }
    catch (error) {
        console.error("Error in marking notification as read:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while updating notification.",
            data: null,
        });
    }
});
exports.markNotificationAsRead = markNotificationAsRead;
//withdraw request pending by a user
const withdrawMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user_id, amount } = req.body; // Extract userId and amount from the request body
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const transactionHistoryRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
        // Fetch the user from the database
        const user = yield userRepo.findOne({ where: { id: user_id } });
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
        const transaction = new TransactionHistory_1.TransactionHistory();
        transaction.user = user;
        transaction.transaction_type = "Withdrawal";
        transaction.amount = amount;
        transaction.transaction_date = new Date();
        transaction.transaction_status = "Pending"; // Status is "Pending" initially
        transaction.description = "User withdrawal request";
        // Save the transaction history record
        yield transactionHistoryRepo.save(transaction);
        return res.status(200).json({
            success: true,
            message: "Withdrawal request created and is pending.",
            data: transaction, // Return the created transaction as part of the response
        });
    }
    catch (error) {
        console.error("Error in withdrawMoney:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while processing the withdrawal.",
            data: null,
        });
    }
});
exports.withdrawMoney = withdrawMoney;
//admin approving the transaction
const adminApproveWithdrawal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params; // Extract transactionId from the route parameters
    try {
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const transactionHistoryRepo = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
        // Fetch the transaction from the database
        const transaction = yield transactionHistoryRepo.findOne({
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
        console.log(`Checking if user has enough prize money: ${userPrizeMoney} >= ${withdrawalAmount}`);
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
            yield userRepo.save(user);
            yield transactionHistoryRepo.save(transaction);
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
        }
        else {
            return res.status(400).json({
                success: false,
                message: "User does not have enough prize money to complete the withdrawal.",
                data: null,
            });
        }
    }
    catch (error) {
        console.error("Error in adminApproveWithdrawal:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while approving the withdrawal.",
            data: null,
        });
    }
});
exports.adminApproveWithdrawal = adminApproveWithdrawal;
