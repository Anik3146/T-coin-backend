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
const QuestionBankController_1 = require("../controllers/QuestionBankController");
const router = (0, express_1.Router)();
// Route to get all questions
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, QuestionBankController_1.getAllQuestions)(req, res);
    }
    catch (error) {
        console.error("Error in fetching questions:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to add a new question
router.post("/add", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, QuestionBankController_1.createQuestion)(req, res);
    }
    catch (error) {
        console.error("Error in adding question:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get a question by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, QuestionBankController_1.getQuestionById)(req, res);
    }
    catch (error) {
        console.error("Error in fetching question by ID:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update a question
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, QuestionBankController_1.updateQuestion)(req, res);
    }
    catch (error) {
        console.error("Error in updating question:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete a question by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, QuestionBankController_1.deleteQuestion)(req, res);
    }
    catch (error) {
        console.error("Error in deleting question:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
