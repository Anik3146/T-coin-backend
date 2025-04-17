import { Router } from "express";
import {
  getAllContactUsMessages,
  getContactUsMessageById,
  createContactUsMessage,
  updateContactUsMessage,
  deleteContactUsMessage,
} from "../controllers/ContactUsController"; // Import the controller functions

const router = Router();

// Route to get all Contact Us messages
router.get("/", async (req, res) => {
  try {
    await getAllContactUsMessages(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in fetching Contact Us messages:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to get a specific Contact Us message by ID
router.get("/:id", async (req, res) => {
  try {
    await getContactUsMessageById(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in fetching Contact Us message:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// // Route to create a new Contact Us message
// router.post("/", async (req, res) => {
//   try {
//     await createContactUsMessage(req, res); // Call the controller function
//   } catch (error) {
//     console.error("Error in creating Contact Us message:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });

// Route to update a Contact Us message by ID
router.put("/:id", async (req, res) => {
  try {
    await updateContactUsMessage(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in updating Contact Us message:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

// Route to delete a Contact Us message by ID
router.delete("/:id", async (req, res) => {
  try {
    await deleteContactUsMessage(req, res); // Call the controller function
  } catch (error) {
    console.error("Error in deleting Contact Us message:", error);
    res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
});

export default router;
