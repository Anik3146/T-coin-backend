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
const PrizeDetailsController_1 = require("../controllers/PrizeDetailsController");
const router = (0, express_1.Router)();
// Route to get all prize details
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, PrizeDetailsController_1.getPrizeDetails)(req, res);
    }
    catch (error) {
        console.error("Error in fetching prize details:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to add prize details
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, PrizeDetailsController_1.addPrizeDetails)(req, res);
    }
    catch (error) {
        console.error("Error in adding prize details:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get prize details by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, PrizeDetailsController_1.getPrizeDetailsById)(req, res);
    }
    catch (error) {
        console.error("Error in fetching prize details by ID:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update prize details by ID
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, PrizeDetailsController_1.updatePrizeDetails)(req, res); // Handle update using the controller
    }
    catch (error) {
        console.error("Error in updating prize details:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete prize details by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, PrizeDetailsController_1.deletePrizeDetails)(req, res);
    }
    catch (error) {
        console.error("Error in deleting prize details:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
