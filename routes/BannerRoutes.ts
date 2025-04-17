import { Router } from "express";
import {
  createBanner,
  deleteBanner,
  updateBanner,
} from "../controllers/BannerController";
import { upload } from "../middleware/MulterConfig"; // Import the upload configuration

const router = Router();

// Route to create a banner (with image upload)
router.post("/", upload.single("image"), async (req, res) => {
  // 'image' is the key from form-data
  try {
    await createBanner(req, res); // Call the controller to handle the banner creation
  } catch (error) {
    console.error("Error in creating banner:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to update an existing banner (with optional image upload)
router.put("/:id", upload.single("image"), async (req, res) => {
  // 'id' is passed in the URL as a parameter
  try {
    await updateBanner(req, res); // Call the controller to handle the banner update
  } catch (error) {
    console.error("Error in updating banner:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to delete a banner
router.delete("/:id", async (req, res) => {
  // 'id' is passed in the URL as a parameter
  try {
    await deleteBanner(req, res); // Call the controller to handle the banner deletion
  } catch (error) {
    console.error("Error in deleting banner:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

export default router;
