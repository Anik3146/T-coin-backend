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
const SpecialEventController_1 = require("../controllers/SpecialEventController");
const MulterConfig_1 = require("../middleware/MulterConfig");
const router = (0, express_1.Router)();
// Route to get all special events
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SpecialEventController_1.getSpecialEvents)(req, res);
    }
    catch (error) {
        console.error("Error in fetching special events:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to add a new special event
router.post("/add", MulterConfig_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Pass the request to your existing addSpecialEvent function
        yield (0, SpecialEventController_1.addSpecialEvent)(req, res);
    }
    catch (error) {
        console.error("Error in adding special event:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update a special event
router.put("/:id", MulterConfig_1.upload.single("image"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SpecialEventController_1.updateSpecialEvent)(req, res); // Handle the event update
    }
    catch (error) {
        console.error("Error in updating special event:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get a special event by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SpecialEventController_1.getSpecialEventById)(req, res);
    }
    catch (error) {
        console.error("Error in fetching special event by ID:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete a special event
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SpecialEventController_1.deleteSpecialEvent)(req, res);
    }
    catch (error) {
        console.error("Error in deleting special event:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
