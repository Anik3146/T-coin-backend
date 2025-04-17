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
exports.deleteSubject = exports.updateSubject = exports.createSubject = exports.getSubjectById = exports.fetchSubjectsBasic = exports.getAllSubjects = void 0;
const data_source_1 = require("../data-source");
const Subject_1 = require("../entities/Subject");
const getAllSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        // Fetch all subjects with their associated questions
        const subjects = yield subjectRepo.find({
            relations: ["questions"], // Load the related questions for each subject
        });
        return res.status(200).json({
            success: true,
            message: "Subjects fetched successfully",
            data: subjects,
        });
    }
    catch (error) {
        console.error("Error fetching subjects:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching subjects",
            data: null,
        });
    }
});
exports.getAllSubjects = getAllSubjects;
//for dropdown
const fetchSubjectsBasic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        // Only select id and name (assuming name is the column you're interested in)
        const subjects = yield subjectRepo.find({
            select: ["id", "name"], // Select only the fields you want
        });
        return res.status(200).json({
            success: true,
            message: "Subjects fetched successfully",
            data: subjects,
        });
    }
    catch (error) {
        console.error("Error fetching subjects:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching subjects",
            data: null,
        });
    }
});
exports.fetchSubjectsBasic = fetchSubjectsBasic;
const getSubjectById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        // Fetch the subject with the associated questions
        const subject = yield subjectRepo.findOne({
            where: { id: Number(id) },
            relations: ["questions"], // Load related questions
        });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Subject fetched successfully",
            data: subject,
        });
    }
    catch (error) {
        console.error("Error fetching subject:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching subject",
            data: null,
        });
    }
});
exports.getSubjectById = getSubjectById;
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = req.body;
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        const newSubject = new Subject_1.Subject();
        newSubject.name = name;
        const savedSubject = yield subjectRepo.save(newSubject);
        return res.status(201).json({
            success: true,
            message: "Subject created successfully",
            data: savedSubject,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error creating subject",
            data: null,
        });
    }
});
exports.createSubject = createSubject;
const updateSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { name } = req.body;
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        const subject = yield subjectRepo.findOne({ where: { id: Number(id) } });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
                data: null,
            });
        }
        subject.name = name || subject.name;
        const updatedSubject = yield subjectRepo.save(subject);
        return res.status(200).json({
            success: true,
            message: "Subject updated successfully",
            data: updatedSubject,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error updating subject",
            data: null,
        });
    }
});
exports.updateSubject = updateSubject;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        const subject = yield subjectRepo.findOne({ where: { id: Number(id) } });
        if (!subject) {
            return res.status(404).json({
                success: false,
                message: "Subject not found",
                data: null,
            });
        }
        yield subjectRepo.remove(subject);
        return res.status(200).json({
            success: true,
            message: "Subject deleted successfully",
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting subject",
            data: null,
        });
    }
});
exports.deleteSubject = deleteSubject;
