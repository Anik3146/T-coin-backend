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
const ChallengeHistoryController_1 = require("../controllers/ChallengeHistoryController");
const router = (0, express_1.Router)();
// Route to get all challenge histories
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeHistoryController_1.getAllChallengeHistories)(req, res);
    }
    catch (error) {
        console.error("Error in fetching challenge histories:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get categorized challenge history by user ID
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attach userId to query so the controller can use it
        req.query.userId = req.params.userId;
        yield (0, ChallengeHistoryController_1.getAllChallengeHistories)(req, res);
    }
    catch (error) {
        console.error("Error in fetching challenge history for user:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to add a new challenge history record
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeHistoryController_1.addChallengeHistory)(req, res);
    }
    catch (error) {
        console.error("Error in adding challenge history:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update challenge history by ID
router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeHistoryController_1.updateChallengeHistory)(req, res);
    }
    catch (error) {
        console.error("Error in updating challenge history:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete challenge history by ID
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeHistoryController_1.deleteChallengeHistory)(req, res);
    }
    catch (error) {
        console.error("Error in deleting challenge history:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
