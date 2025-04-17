import { Request, Response } from "express";
import { AppDataSource } from "../data-source"; // Import the data source
import { ContactUs } from "../entities/Contact"; // Import the ContactUs entity
import { User } from "../entities/User"; // Import User entity

// Get all Contact Us messages
export const getAllContactUsMessages = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactUsRepo = AppDataSource.getRepository(ContactUs);

  try {
    const contactUsMessages = await contactUsRepo.find({ relations: ["user"] });
    return res.status(200).json({
      success: true,
      message: "All Contact Us messages fetched successfully",
      data: contactUsMessages,
    });
  } catch (error: any) {
    console.error("Error in fetching Contact Us messages:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Get Contact Us message by ID
export const getContactUsMessageById = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactUsRepo = AppDataSource.getRepository(ContactUs);

  try {
    // Ensure the id is converted to a number
    const messageId = parseInt(req.params.id, 10); // Convert string to number
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        data: null,
      });
    }

    const contactUsMessage = await contactUsRepo.findOne({
      where: { id: messageId }, // Use the numeric id
      relations: ["user"], // Include user relation
    });

    if (!contactUsMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact Us message not found.",
        data: null,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Contact Us message fetched successfully",
      data: contactUsMessage,
    });
  } catch (error: any) {
    console.error("Error in fetching Contact Us message by ID:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
// Create a new Contact Us message
export const createContactUsMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactUsRepo = AppDataSource.getRepository(ContactUs);

  try {
    const { name, contact_no, message } = req.body;
    const userId = Number(req.params.userId); // Correct: extracting the userId from the params
    // Extract user ID from the route params
    // console.log(userId);
    // Check if the user ID is valid
    if (isNaN(userId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID format",
        data: null,
      });
    }

    // Find the user by ID to ensure the message is associated with a valid user
    const user = await AppDataSource.getRepository(User).findOne({
      where: { id: userId },
    });

    if (!user) {
      // If the user doesn't exist, return a 400 error
      return res.status(400).json({
        success: false,
        message: "User not found",
        data: null,
      });
    }

    // Create a new contact message
    const newContactUsMessage = contactUsRepo.create({
      name,
      contact_no,
      message,
      user, // Link the message to the found user
    });

    // Save the new contact message to the database
    await contactUsRepo.save(newContactUsMessage);

    // Respond with a success message
    return res.status(201).json({
      success: true,
      message: "Contact Us message created successfully",
      data: newContactUsMessage,
    });
  } catch (error: any) {
    console.error("Error in creating Contact Us message:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

//Update Contact Us message by ID
export const updateContactUsMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactUsRepo = AppDataSource.getRepository(ContactUs);

  try {
    // Get the message ID and parse it to a number
    const messageId = Number(req.params);

    // Check if the messageId is valid
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID format.",
        data: null,
      });
    }

    const { name, contact_no, message } = req.body;

    // Find the Contact Us message by the parsed messageId
    const contactUsMessage = await contactUsRepo.findOne({
      where: { id: messageId },
    });

    if (!contactUsMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact Us message not found.",
        data: null,
      });
    }

    // Update the fields with the new values, or keep existing ones if no new value is provided
    contactUsMessage.name = name || contactUsMessage.name;
    contactUsMessage.contact_no = contact_no || contactUsMessage.contact_no;
    contactUsMessage.message = message || contactUsMessage.message;

    // Save the updated message
    await contactUsRepo.save(contactUsMessage);

    return res.status(200).json({
      success: true,
      message: "Contact Us message updated successfully",
      data: contactUsMessage,
    });
  } catch (error: any) {
    console.error("Error in updating Contact Us message:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};

// Delete Contact Us message by ID
export const deleteContactUsMessage = async (
  req: Request,
  res: Response
): Promise<Response> => {
  const contactUsRepo = AppDataSource.getRepository(ContactUs);

  try {
    // Get the message ID and parse it to a number
    const messageId = parseInt(req.params.id, 10);

    // Check if the messageId is valid
    if (isNaN(messageId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid message ID format.",
        data: null,
      });
    }

    // Find the Contact Us message by the parsed messageId
    const contactUsMessage = await contactUsRepo.findOne({
      where: { id: messageId },
    });

    if (!contactUsMessage) {
      return res.status(404).json({
        success: false,
        message: "Contact Us message not found.",
        data: null,
      });
    }

    // Delete the message
    await contactUsRepo.remove(contactUsMessage);

    return res.status(200).json({
      success: true,
      message: "Contact Us message deleted successfully",
      data: null,
    });
  } catch (error: any) {
    console.error("Error in deleting Contact Us message:", error);
    return res.status(500).json({
      success: false,
      message: "An unexpected error occurred.",
      data: null,
    });
  }
};
