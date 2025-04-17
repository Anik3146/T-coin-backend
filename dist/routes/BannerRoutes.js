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
const BannerController_1 = require("../controllers/BannerController");
const MulterConfig_1 = require("../middleware/MulterConfig"); // Import the upload configuration
const router = (0, express_1.Router)();
// Route to create a banner (with image upload)
router.post("/", MulterConfig_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 'image' is the key from form-data
    try {
        yield (0, BannerController_1.createBanner)(req, res); // Call the controller to handle the banner creation
    }
    catch (error) {
        console.error("Error in creating banner:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update an existing banner (with optional image upload)
router.put("/:id", MulterConfig_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 'id' is passed in the URL as a parameter
    try {
        yield (0, BannerController_1.updateBanner)(req, res); // Call the controller to handle the banner update
    }
    catch (error) {
        console.error("Error in updating banner:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete a banner
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // 'id' is passed in the URL as a parameter
    try {
        yield (0, BannerController_1.deleteBanner)(req, res); // Call the controller to handle the banner deletion
    }
    catch (error) {
        console.error("Error in deleting banner:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
