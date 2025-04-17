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
const BreakingNewsController_1 = require("../controllers/BreakingNewsController");
const router = (0, express_1.Router)();
// Route to create breaking news
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, BreakingNewsController_1.createBreakingNews)(req, res);
    }
    catch (error) {
        console.error("Error in creating breaking news:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to get all breaking news
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, BreakingNewsController_1.getAllBreakingNews)(req, res);
    }
    catch (error) {
        console.error("Error in fetching breaking news:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to update breaking news
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, BreakingNewsController_1.updateBreakingNews)(req, res);
    }
    catch (error) {
        console.error("Error in updating breaking news:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
// Route to delete breaking news
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, BreakingNewsController_1.deleteBreakingNews)(req, res);
    }
    catch (error) {
        console.error("Error in deleting breaking news:", error);
        res.status(500).json({ message: "An unexpected error occurred." });
    }
}));
exports.default = router;
