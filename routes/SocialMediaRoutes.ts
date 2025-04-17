import { Router } from "express";
import {
  createSocialMedia,
  getAllSocialMedia,
  getSocialMediaById,
  updateSocialMedia,
  deleteSocialMedia,
} from "../controllers/SocialMediaController"; // Import the controller functions
import { upload } from "../middleware/MulterConfig";

const router = Router();

// Route to create a new social media entry (with icon upload)
router.post("/", upload.single("icon"), async (req, res) => {
  // 'icon' is the key from form-data
  try {
    await createSocialMedia(req, res); // Call the controller to handle the social media creation
  } catch (error) {
    console.error("Error in creating social media entry:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});
// Route to get all social media entries
router.get("/", async (req, res) => {
  try {
    await getAllSocialMedia(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in fetching social media entries:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to get a specific social media entry by ID
router.get("/:id", async (req, res) => {
  try {
    await getSocialMediaById(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in fetching social media entry:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to update a social media entry by ID
router.put("/:id", async (req, res) => {
  try {
    await updateSocialMedia(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in updating social media entry:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

// Route to delete a social media entry by ID
router.delete("/:id", async (req, res) => {
  try {
    await deleteSocialMedia(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in deleting social media entry:", error);
    res.status(500).json({ message: "An unexpected error occurred." });
  }
});

export default router;
