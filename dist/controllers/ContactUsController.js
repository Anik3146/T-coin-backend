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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteContactUsMessage = exports.updateContactUsMessage = exports.createContactUsMessage = exports.getContactUsMessageById = exports.getAllContactUsMessages = void 0;
const data_source_1 = require("../data-source"); // Import the data source
const Contact_1 = require("../entities/Contact"); // Import the ContactUs entity
const User_1 = require("../entities/User"); // Import User entity
// Get all Contact Us messages
const getAllContactUsMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactUsRepo = data_source_1.AppDataSource.getRepository(Contact_1.ContactUs);
    try {
        const contactUsMessages = yield contactUsRepo.find({ relations: ["user"] });
        return res.status(200).json({
            success: true,
            message: "All Contact Us messages fetched successfully",
            data: contactUsMessages,
        });
    }
    catch (error) {
        console.error("Error in fetching Contact Us messages:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getAllContactUsMessages = getAllContactUsMessages;
// Get Contact Us message by ID
const getContactUsMessageById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactUsRepo = data_source_1.AppDataSource.getRepository(Contact_1.ContactUs);
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
        const contactUsMessage = yield contactUsRepo.findOne({
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
    }
    catch (error) {
        console.error("Error in fetching Contact Us message by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getContactUsMessageById = getContactUsMessageById;
// Create a new Contact Us message
const createContactUsMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactUsRepo = data_source_1.AppDataSource.getRepository(Contact_1.ContactUs);
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
        const user = yield data_source_1.AppDataSource.getRepository(User_1.User).findOne({
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
        yield contactUsRepo.save(newContactUsMessage);
        // Respond with a success message
        return res.status(201).json({
            success: true,
            message: "Contact Us message created successfully",
            data: newContactUsMessage,
        });
    }
    catch (error) {
        console.error("Error in creating Contact Us message:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.createContactUsMessage = createContactUsMessage;
//Update Contact Us message by ID
const updateContactUsMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactUsRepo = data_source_1.AppDataSource.getRepository(Contact_1.ContactUs);
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
        const contactUsMessage = yield contactUsRepo.findOne({
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
        yield contactUsRepo.save(contactUsMessage);
        return res.status(200).json({
            success: true,
            message: "Contact Us message updated successfully",
            data: contactUsMessage,
        });
    }
    catch (error) {
        console.error("Error in updating Contact Us message:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateContactUsMessage = updateContactUsMessage;
// Delete Contact Us message by ID
const deleteContactUsMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contactUsRepo = data_source_1.AppDataSource.getRepository(Contact_1.ContactUs);
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
        const contactUsMessage = yield contactUsRepo.findOne({
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
        yield contactUsRepo.remove(contactUsMessage);
        return res.status(200).json({
            success: true,
            message: "Contact Us message deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting Contact Us message:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteContactUsMessage = deleteContactUsMessage;
