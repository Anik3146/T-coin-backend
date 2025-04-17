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
const SocialMediaController_1 = require("../controllers/SocialMediaController"); // Import the controller functions
const MulterConfig_1 = require("../middleware/MulterConfig");
const router = (0, express_1.Router)();
// Route to create a new social media entry (with icon upload)
router.post("/", MulterConfig_1.upload.single("icon"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 'icon' is the key from form-data
    try {
        yield (0, SocialMediaController_1.createSocialMedia)(req, res); // Call the controller to handle the social media creation
    }
    catch (error) {
        console.error("Error in creating social media entry:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get all social media entries
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SocialMediaController_1.getAllSocialMedia)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching social media entries:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to get a specific social media entry by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SocialMediaController_1.getSocialMediaById)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching social media entry:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to update a social media entry by ID
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SocialMediaController_1.updateSocialMedia)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in updating social media entry:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to delete a social media entry by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SocialMediaController_1.deleteSocialMedia)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in deleting social media entry:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
exports.default = router;
