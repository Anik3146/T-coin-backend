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
const ActivityLogController_1 = require("../controllers/ActivityLogController");
const router = (0, express_1.Router)();
// Route to get all activity logs
router.get("/all", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ActivityLogController_1.getAllActivityLogs)(req, res);
    }
    catch (error) {
        console.error("Error in fetching activity logs:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get activity logs by user ID
router.get("/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ActivityLogController_1.getActivityLogsByUserId)(req, res);
    }
    catch (error) {
        console.error("Error in fetching activity logs for user:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to add a new activity log
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ActivityLogController_1.addActivityLog)(req, res);
    }
    catch (error) {
        console.error("Error in adding activity log:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update activity log by ID
router.put("/update/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ActivityLogController_1.updateActivityLog)(req, res);
    }
    catch (error) {
        console.error("Error in updating activity log:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete activity log by ID
router.delete("/delete/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ActivityLogController_1.deleteActivityLog)(req, res);
    }
    catch (error) {
        console.error("Error in deleting activity log:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
