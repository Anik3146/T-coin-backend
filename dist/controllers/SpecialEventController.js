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
exports.registerForEvent = exports.deleteSpecialEvent = exports.getSpecialEventById = exports.updateSpecialEvent = exports.addSpecialEvent = exports.getSpecialEvents = void 0;
const data_source_1 = require("../data-source");
const SpecialEvent_1 = require("../entities/SpecialEvent");
const User_1 = require("../entities/User");
const constant_1 = __importDefault(require("../utils/constant"));
// Helper function to validate event_code
const isValidEventCode = (eventCode) => {
    return eventCode === "1234X@";
};
// Get all special events
const getSpecialEvents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialEventRepo = data_source_1.AppDataSource.getRepository(SpecialEvent_1.SpecialEvent);
    try {
        const events = yield specialEventRepo.find({
            relations: ["users"], // Optionally fetch users related to the special event
        });
        if (!events || events.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No special events found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Special events fetched successfully.",
            data: events,
        });
    }
    catch (error) {
        console.error("Error in fetching special events:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getSpecialEvents = getSpecialEvents;
// Add a new special event
const addSpecialEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialEventRepo = data_source_1.AppDataSource.getRepository(SpecialEvent_1.SpecialEvent);
    try {
        const { time, location, active_status, event_code } = req.body;
        const eventImage = req.file; // Assuming 'eventImage' is uploaded as form-data
        // Validate event_code
        if (!isValidEventCode(event_code)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event_code. Must be '1234X@'.",
                data: null,
            });
        }
        // Check if event image is provided
        if (!eventImage) {
            return res.status(400).json({
                success: false,
                message: "Event image is required.",
                data: null,
            });
        }
        // Generate the event image URL/path
        const eventImagePath = `${constant_1.default}/uploads/${eventImage.filename}`;
        // Create the special event entry and save it to the DB
        const newSpecialEvent = new SpecialEvent_1.SpecialEvent();
        newSpecialEvent.time = time;
        newSpecialEvent.location = location;
        newSpecialEvent.active_status = active_status == "true" ? true : false;
        newSpecialEvent.event_code = event_code;
        newSpecialEvent.image = eventImagePath; // Save the event image URL/path
        newSpecialEvent.createdAt = new Date();
        newSpecialEvent.updatedAt = new Date();
        yield specialEventRepo.save(newSpecialEvent);
        return res.status(201).json({
            success: true,
            message: "Special event added successfully.",
            data: newSpecialEvent,
        });
    }
    catch (error) {
        console.error("Error in adding special event:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addSpecialEvent = addSpecialEvent;
// Update a special event
const updateSpecialEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialEventRepo = data_source_1.AppDataSource.getRepository(SpecialEvent_1.SpecialEvent);
    try {
        const eventId = req.params.id;
        const { time, location, active_status, event_code } = req.body;
        const eventImage = req.file; // Assuming 'eventImage' is uploaded as form-data (optional for update)
        // Validate event_code
        if (event_code && !isValidEventCode(event_code)) {
            return res.status(400).json({
                success: false,
                message: "Invalid event_code. Must be '1234X@'.",
                data: null,
            });
        }
        const specialEventToUpdate = yield specialEventRepo.findOne({
            where: { id: parseInt(eventId) },
        });
        if (!specialEventToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Special event not found.",
                data: null,
            });
        }
        // If event image is provided, update the event image URL/path
        if (eventImage) {
            const eventImagePath = `${constant_1.default}/uploads/${eventImage.filename}`;
            specialEventToUpdate.image = eventImagePath; // Save the new image URL/path
        }
        // Update other fields if provided
        specialEventToUpdate.time = time || specialEventToUpdate.time;
        specialEventToUpdate.location = location || specialEventToUpdate.location;
        specialEventToUpdate.active_status =
            active_status == "true"
                ? true
                : false || specialEventToUpdate.active_status;
        specialEventToUpdate.event_code =
            event_code || specialEventToUpdate.event_code;
        specialEventToUpdate.updatedAt = new Date();
        yield specialEventRepo.save(specialEventToUpdate);
        return res.status(200).json({
            success: true,
            message: "Special event updated successfully.",
            data: specialEventToUpdate,
        });
    }
    catch (error) {
        console.error("Error in updating special event:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateSpecialEvent = updateSpecialEvent;
// Get special event by ID
const getSpecialEventById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialEventRepo = data_source_1.AppDataSource.getRepository(SpecialEvent_1.SpecialEvent);
    try {
        const eventId = req.params.id;
        const specialEvent = yield specialEventRepo.findOne({
            where: { id: parseInt(eventId) },
            relations: ["users"], // Optionally fetch users related to the special event
        });
        if (!specialEvent) {
            return res.status(404).json({
                success: false,
                message: "Special event not found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Special event fetched successfully.",
            data: specialEvent,
        });
    }
    catch (error) {
        console.error("Error in fetching special event by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getSpecialEventById = getSpecialEventById;
// Delete a special event
const deleteSpecialEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const specialEventRepo = data_source_1.AppDataSource.getRepository(SpecialEvent_1.SpecialEvent);
    try {
        const eventId = req.params.id;
        const specialEventToDelete = yield specialEventRepo.findOne({
            where: { id: parseInt(eventId) },
        });
        if (!specialEventToDelete) {
            return res.status(404).json({
                success: false,
                message: "Special event not found.",
                data: null,
            });
        }
        yield specialEventRepo.remove(specialEventToDelete);
        return res.status(200).json({
            success: true,
            message: "Special event deleted successfully.",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting special event:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteSpecialEvent = deleteSpecialEvent;
const registerForEvent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { userId } = req.params; // The ID of the user
    const { eventId, event_code } = req.body; // The event ID and event_code the user wants to register for
    try {
        // Ensure the logged-in user is the same as the user whose registration is being modified
        if (Number(userId) !== ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id)) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        // Get the user and the special event repositories
        const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
        const specialEventRepo = data_source_1.AppDataSource.getRepository(SpecialEvent_1.SpecialEvent);
        // Fetch the user by ID
        const user = yield userRepo.findOne({
            where: { id: parseInt(userId) },
            relations: ["special_events"], // Make sure to load the special_events relation
        });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }
        // Fetch the special event by ID
        const specialEvent = yield specialEventRepo.findOne({
            where: { id: parseInt(eventId) },
        });
        if (!specialEvent) {
            return res.status(404).json({
                success: false,
                message: "Special event not found.",
                data: null,
            });
        }
        // Check if the event is still active
        if (!specialEvent.active_status) {
            return res.status(400).json({
                success: false,
                message: "This event is no longer active.",
                data: null,
            });
        }
        // Check if the event_code matches
        if (specialEvent.event_code !== event_code) {
            return res.status(400).json({
                success: false,
                message: "Invalid event_code. Registration failed.",
                data: null,
            });
        }
        // Check if the user is already registered for the event
        if (user.special_events &&
            user.special_events.some((event) => event.id === specialEvent.id)) {
            return res.status(400).json({
                success: false,
                message: "User is already registered for this event.",
                data: null,
            });
        }
        // Register the user for the special event
        if (!user.special_events) {
            user.special_events = []; // Initialize the special_events array if not already initialized
        }
        user.special_events.push(specialEvent); // Add the event to the user's special events
        // Save the updated user entity
        yield userRepo.save(user);
        return res.status(200).json({
            success: true,
            message: "User registered for the special event successfully.",
            data: user,
        });
    }
    catch (error) {
        console.error("Error in registering user for event:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.registerForEvent = registerForEvent;
