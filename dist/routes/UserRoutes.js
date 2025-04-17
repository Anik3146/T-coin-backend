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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserController_1 = require("../controllers/UserController");
const Authentication_1 = require("../middleware/Authentication");
const AppInfoController_1 = require("../controllers/AppInfoController");
const DeviceInfoController_1 = require("../controllers/DeviceInfoController");
const ActivityLogController_1 = require("../controllers/ActivityLogController");
const ContactUsController_1 = require("../controllers/ContactUsController");
const MulterConfig_1 = require("../middleware/MulterConfig");
const router = express_1.default.Router();
// Sign In route
router.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, UserController_1.signIn)(req, res);
    }
    catch (error) {
        console.error("Error in signing in user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Forgot Password route
router.post("/forgot-password", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, UserController_1.forgotPassword)(req, res);
    }
    catch (error) {
        console.error("Error in processing forgot password request:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Create User route
router.post("/", MulterConfig_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Ensure req.file is properly typed as Multer file
        const { file } = req;
        if (file) {
            // If file is uploaded, you can access it as `file.filename` or `file.path`
            console.log("File uploaded:", file.filename);
        }
        // Call the createUser function (which will handle the logic, including saving the user and image)
        yield (0, UserController_1.createUser)(req, res);
    }
    catch (error) {
        console.error("Error in creating user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
router.post("/with-multiple-files", MulterConfig_1.upload.fields([
    { name: "image", maxCount: 1 },
    { name: "nid_card_front", maxCount: 1 },
    { name: "nid_card_back", maxCount: 1 },
    { name: "passport", maxCount: 1 },
]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Handle the uploaded files
        console.log("Files uploaded:", req.files);
        // Call your user creation logic here
        yield (0, UserController_1.createUser)(req, res);
    }
    catch (error) {
        console.error("Error in creating user with multiple files:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Update User route
router.put("/:id", Authentication_1.authenticateToken, // Assuming you have a token authentication middleware
MulterConfig_1.upload.single("image"), // Only handle single file upload for 'image' field
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Using 'any' here, but you can type it more strictly if needed
    try {
        const { id } = req.params;
        // Ensure the logged-in user is the same as the user being updated
        if (Number(id) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        // Ensure req.file is properly typed as Multer file
        const { file } = req;
        if (file) {
            // If file is uploaded, you can access it as `file.filename` or `file.path`
            console.log("File uploaded:", file.filename);
        }
        // Call the updateUser function after multer has handled the file upload
        yield (0, UserController_1.updateUser)(req, res);
    }
    catch (error) {
        console.error("Error in updating user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Get all users route
router.get("/", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, UserController_1.getUsers)(req, res);
    }
    catch (error) {
        console.error("Error in fetching users:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Get user by ID route
router.get("/:id", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Ensure the logged-in user is the same as the user being accessed
        if (Number(id) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        yield (0, UserController_1.getUserById)(req, res);
    }
    catch (error) {
        console.error("Error in fetching user by ID:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Delete User route
router.delete("/:id", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Ensure the logged-in user is the same as the user being deleted
        if (Number(id) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        yield (0, UserController_1.deleteUser)(req, res);
    }
    catch (error) {
        console.error("Error in deleting user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Add or Update App Info for a User
router.put("/:userId/appinfo", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Ensure the logged-in user is the same as the user whose app info is being modified
        if (Number(userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        yield (0, AppInfoController_1.addOrUpdateAppInfoForUser)(req, res);
    }
    catch (error) {
        console.error("Error in adding/updating app info for user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Add or Update Device Info for a User
router.put("/:userId/deviceinfo", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Ensure the logged-in user is the same as the user whose device info is being modified
        if (Number(userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        yield (0, DeviceInfoController_1.addOrUpdateDeviceInfoForUser)(req, res);
    }
    catch (error) {
        console.error("Error in adding/updating device info for user:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Add a route for posting activity log
router.post("/:userId/activity-log", // URL pattern where userId is a URL parameter
Authentication_1.authenticateToken, // Ensure the user is authenticated
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        // Ensure the logged-in user is the same as the user whose activity log is being posted
        if (Number(userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        yield (0, ActivityLogController_1.addActivityLog)(req, res); // Call the controller function to add the activity log
    }
    catch (error) {
        console.error("Error in posting activity log:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Add the route for posting a Contact Us message
router.post("/:userId/contact-us", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Extract userId from route parameters
        // console.log(userId);
        // Check if the logged-in user matches the userId from the route
        if (Number(userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        // Call the function to create the "Contact Us" message
        yield (0, ContactUsController_1.createContactUsMessage)(req, res);
    }
    catch (error) {
        console.error("Error in posting Contact Us message:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// API Route for fetching the balance of a user
router.get("/:userId/balance", // Route for fetching the balance for a user
Authentication_1.authenticateToken, // Ensure the user is authenticated
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params; // Extract userId from the route parameters
        // Ensure that the logged-in user matches the userId from the route
        if (Number(userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        // Call the function to get the balance for the user
        yield (0, UserController_1.getUserBalance)(req, res);
    }
    catch (error) {
        console.error("Error fetching user balance:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// **New Route** to mark a notification as read by its ID
router.put("/:userId/notifications/:notificationId/read", Authentication_1.authenticateToken, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { user_id } = req.body;
        if (!user_id)
            return res
                .status(500)
                .json({ message: "provide an user id in the body payload." });
        if (Number(userId) != Number(req.user.id))
            return res
                .status(500)
                .json({ message: "userId does not match with token." });
        yield (0, UserController_1.markNotificationAsRead)(req, res); // Call the function to mark as read
    }
    catch (error) {
        console.error("Error in marking notification as read:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
        });
    }
}));
// **New Route** for a user to withdraw money (Create Pending Transaction)
router.post("/:userId/withdraw", Authentication_1.authenticateToken, // Authentication middleware
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const { user_id, amount } = req.body;
        if (!user_id)
            return res
                .status(500)
                .json({ message: "Provide a user ID in the body payload." });
        if (Number(userId) !== Number(req.user.id))
            return res
                .status(500)
                .json({ message: "User ID does not match with token." });
        if (!amount || amount <= 0)
            return res.status(500).json({ message: "Provide a valid amount." });
        // Call the function to withdraw money
        yield (0, UserController_1.withdrawMoney)(req, res); // Calls the function to create the pending transaction
    }
    catch (error) {
        console.error("Error in processing withdrawal request:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while processing the withdrawal.",
        });
    }
}));
exports.default = router;
