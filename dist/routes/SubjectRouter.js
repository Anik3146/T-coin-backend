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
const SubjectController_1 = require("../controllers/SubjectController"); // Import the controller functions
const router = (0, express_1.Router)();
// Route to get all subjects
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SubjectController_1.getAllSubjects)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching subjects:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get subject name and id
router.get("/list", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SubjectController_1.fetchSubjectsBasic)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching subjects:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to get subject by ID
router.get("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SubjectController_1.getSubjectById)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in fetching subject:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to create a new subject
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SubjectController_1.createSubject)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in creating subject:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to update a subject by ID
router.put("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SubjectController_1.updateSubject)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in updating subject:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
// Route to delete a subject by ID
router.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, SubjectController_1.deleteSubject)(req, res); // Call the controller function
    }
    catch (error) {
        console.error("Error in deleting subject:", error);
        res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
}));
exports.default = router;
