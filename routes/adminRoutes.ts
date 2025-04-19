import express from "express";
import {
  signIn,
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserBalance,
  markNotificationAsRead,
  withdrawMoney,
  forgotPassword,
} from "../controllers/AdminController";
import { authenticateToken } from "../middleware/Authentication";
import { addOrUpdateAppInfoForUser } from "../controllers/AppInfoController";
import { addOrUpdateDeviceInfoForUser } from "../controllers/DeviceInfoController";
import { addActivityLog } from "../controllers/ActivityLogController";
import { createContactUsMessage } from "../controllers/ContactUsController";
import { upload } from "../middleware/MulterConfig";

const router = express.Router();

// Sign In route
router.post("/signin", async (req, res) => {
  try {
    await signIn(req, res);
  } catch (error) {
    console.error("Error in signing in user:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Forgot Password route
router.post("/forgot-password", async (req, res) => {
  try {
    await forgotPassword(req, res);
  } catch (error) {
    console.error("Error in processing forgot password request:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Create User route
router.post("/", upload.single("image"), async (req, res) => {
  try {
    // Ensure req.file is properly typed as Multer file
    const { file } = req;
    if (file) {
      // If file is uploaded, you can access it as `file.filename` or `file.path`
      console.log("File uploaded:", file.filename);
    }

    // Call the createUser function (which will handle the logic, including saving the user and image)
    await createUser(req, res);
  } catch (error) {
    console.error("Error in creating user:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

router.post(
  "/with-multiple-files",
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "nid_card_front", maxCount: 1 },
    { name: "nid_card_back", maxCount: 1 },
    { name: "passport", maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      // Handle the uploaded files
      console.log("Files uploaded:", req.files);

      // Call your user creation logic here
      await createUser(req, res);
    } catch (error) {
      console.error("Error in creating user with multiple files:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// Update User route
router.put(
  "/:id",
  authenticateToken, // Assuming you have a token authentication middleware
  upload.fields([
    { name: "image", maxCount: 1 }, // Single image upload
    { name: "nid_card_front", maxCount: 1 }, // Single NID card front image upload
    { name: "nid_card_back", maxCount: 1 }, // Single NID card back image upload
    { name: "passport", maxCount: 1 }, // Single passport file upload
  ]),
  async (req: any, res: any) => {
    try {
      const { id } = req.params;

      // Ensure the logged-in user is the same as the user being updated
      if (Number(id) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      // Handle files if they are uploaded
      const { files } = req;

      // Log file uploads for debugging purposes
      if (files) {
        console.log("Uploaded files:", files);
      }

      // Call the updateUser function after multer has handled the file uploads
      await updateUser(req, res);
    } catch (error) {
      console.error("Error in updating user:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// Get all users route
router.get("/", authenticateToken, async (req, res) => {
  try {
    await getUsers(req, res);
  } catch (error) {
    console.error("Error in fetching users:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Get user by ID route
router.get("/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Ensure the logged-in user is the same as the user being accessed
    if (Number(id) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    await getUserById(req, res);
  } catch (error) {
    console.error("Error in fetching user by ID:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Delete User route
router.delete("/:id", authenticateToken, async (req: any, res: any) => {
  try {
    const { id } = req.params;

    // Ensure the logged-in user is the same as the user being deleted
    if (Number(id) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized access." });
    }

    await deleteUser(req, res);
  } catch (error) {
    console.error("Error in deleting user:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Add or Update App Info for a User
router.put(
  "/:userId/appinfo",
  authenticateToken,
  async (req: any, res: any) => {
    try {
      const { userId } = req.params;

      // Ensure the logged-in user is the same as the user whose app info is being modified
      if (Number(userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      await addOrUpdateAppInfoForUser(req, res);
    } catch (error) {
      console.error("Error in adding/updating app info for user:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// Add or Update Device Info for a User
router.put(
  "/:userId/deviceinfo",
  authenticateToken,
  async (req: any, res: any) => {
    try {
      const { userId } = req.params;

      // Ensure the logged-in user is the same as the user whose device info is being modified
      if (Number(userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      await addOrUpdateDeviceInfoForUser(req, res);
    } catch (error) {
      console.error("Error in adding/updating device info for user:", error);
      res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// Add a route for posting activity log
router.post(
  "/:userId/activity-log", // URL pattern where userId is a URL parameter
  authenticateToken, // Ensure the user is authenticated
  async (req: any, res: any) => {
    try {
      const { userId } = req.params;

      // Ensure the logged-in user is the same as the user whose activity log is being posted
      if (Number(userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      await addActivityLog(req, res); // Call the controller function to add the activity log
    } catch (error) {
      console.error("Error in posting activity log:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// Add the route for posting a Contact Us message
router.post(
  "/:userId/contact-us",
  authenticateToken,
  async (req: any, res: any) => {
    try {
      const { userId } = req.params; // Extract userId from route parameters
      // console.log(userId);
      // Check if the logged-in user matches the userId from the route
      if (Number(userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      // Call the function to create the "Contact Us" message
      await createContactUsMessage(req, res);
    } catch (error) {
      console.error("Error in posting Contact Us message:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// API Route for fetching the balance of a user
router.get(
  "/:userId/balance", // Route for fetching the balance for a user
  authenticateToken, // Ensure the user is authenticated
  async (req: any, res: any) => {
    try {
      const { userId } = req.params; // Extract userId from the route parameters

      // Ensure that the logged-in user matches the userId from the route
      if (Number(userId) !== req.user.id) {
        return res.status(403).json({ message: "Unauthorized access." });
      }

      // Call the function to get the balance for the user
      await getUserBalance(req, res);
    } catch (error) {
      console.error("Error fetching user balance:", error);
      return res.status(500).json({ message: "An unexpected error occurred." });
    }
  }
);

// **New Route** to mark a notification as read by its ID
router.put(
  "/:userId/notifications/:notificationId/read",
  authenticateToken,
  async (req: any, res: any) => {
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
      await markNotificationAsRead(req, res); // Call the function to mark as read
    } catch (error) {
      console.error("Error in marking notification as read:", error);
      return res.status(500).json({
        success: false,
        message: "An unexpected error occurred.",
      });
    }
  }
);

// **New Route** for a user to withdraw money (Create Pending Transaction)
router.post(
  "/:userId/withdraw",
  authenticateToken, // Authentication middleware
  async (req: any, res: any) => {
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
      await withdrawMoney(req, res); // Calls the function to create the pending transaction
    } catch (error) {
      console.error("Error in processing withdrawal request:", error);
      return res.status(500).json({
        success: false,
        message:
          "An unexpected error occurred while processing the withdrawal.",
      });
    }
  }
);

export default router;
