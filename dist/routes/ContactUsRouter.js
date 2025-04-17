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
const express_1 = require("express");
const ContactUsController_1 = require("../controllers/ContactUsController"); // Import the controller functions
const router = (0, express_1.Router)();
// Route to get all Contact Us messages
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ContactUsController_1.getAllContactUsMessages)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching Contact Us messages:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get a specific Contact Us message by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ContactUsController_1.getContactUsMessageById)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching Contact Us message:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
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
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ContactUsController_1.updateContactUsMessage)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in updating Contact Us message:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete a Contact Us message by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ContactUsController_1.deleteContactUsMessage)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in deleting Contact Us message:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
