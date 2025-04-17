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
exports.deleteQuestion = exports.updateQuestion = exports.createQuestion = exports.getQuestionById = exports.getAllQuestions = void 0;
const data_source_1 = require("../data-source");
const QuestionBank_1 = require("../entities/QuestionBank");
const Subject_1 = require("../entities/Subject");
// Get all questions and show their corresponding subjects
const getAllQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const questionRepo = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    try {
        // Fetch all questions and load the related subject information
        const questions = yield questionRepo.find({
            relations: ["subject"], // Load the corresponding subject for each question
        });
        return res.status(200).json({
            success: true,
            message: "Questions fetched successfully",
            data: questions,
        });
    }
    catch (error) {
        console.error("Error fetching questions:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching questions",
            data: null,
        });
    }
});
exports.getAllQuestions = getAllQuestions;
// Get a single question by ID and show its corresponding subject
const getQuestionById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const questionRepo = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    try {
        // Fetch the question by ID and load the related subject information
        const question = yield questionRepo.findOne({
            where: { id: Number(id) },
            relations: ["subject"], // Load the corresponding subject for the question
        });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Question fetched successfully",
            data: question,
        });
    }
    catch (error) {
        console.error("Error fetching question:", error);
        return res.status(500).json({
            success: false,
            message: "Error fetching question",
            data: null,
        });
    }
});
exports.getQuestionById = getQuestionById;
const createQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { question, answers, correct_answer, subjectId, eligibility_flag, score, } = req.body;
    const questionRepo = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        const subject = yield subjectRepo.findOne({ where: { id: subjectId } });
        if (!subject) {
            return res.status(400).json({
                success: false,
                message: "Subject not found",
                data: null,
            });
        }
        // Validate 'answers' as an array of strings
        if (!Array.isArray(answers) ||
            !answers.every((item) => typeof item === "string")) {
            return res.status(400).json({
                success: false,
                message: "Answers must be an array of strings",
                data: null,
            });
        }
        // Validate 'correct_answer' as a number
        if (typeof correct_answer !== "number") {
            return res.status(400).json({
                success: false,
                message: "Correct answer must be a number (index)",
                data: null,
            });
        }
        // Validate 'eligibility_flag' as an array of strings
        if (!Array.isArray(eligibility_flag) ||
            !eligibility_flag.every((item) => typeof item === "string")) {
            return res.status(400).json({
                success: false,
                message: "Eligibility flag must be an array of strings",
                data: null,
            });
        }
        const newQuestion = new QuestionBank_1.QuestionBank();
        newQuestion.question = question;
        newQuestion.answers = answers;
        newQuestion.correct_answer = correct_answer;
        newQuestion.subject = subject;
        newQuestion.eligibility_flag = eligibility_flag;
        newQuestion.score = score || 0;
        const savedQuestion = yield questionRepo.save(newQuestion);
        return res.status(201).json({
            success: true,
            message: "Question created successfully",
            data: savedQuestion,
        });
    }
    catch (error) {
        console.error("Error in creating question:", error);
        return res.status(500).json({
            success: false,
            message: "Error creating question",
            data: null,
        });
    }
});
exports.createQuestion = createQuestion;
const updateQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { question, answers, correct_answer, subjectId, eligibility_flag, score, } = req.body;
    const questionRepo = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    const subjectRepo = data_source_1.AppDataSource.getRepository(Subject_1.Subject);
    try {
        const questionToUpdate = yield questionRepo.findOne({
            where: { id: Number(id) },
        });
        if (!questionToUpdate) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
                data: null,
            });
        }
        const subject = yield subjectRepo.findOne({ where: { id: subjectId } });
        if (!subject) {
            return res.status(400).json({
                success: false,
                message: "Subject not found",
                data: null,
            });
        }
        // Validate 'answers' as an array of strings if it's provided
        if (answers &&
            (!Array.isArray(answers) ||
                !answers.every((item) => typeof item === "string"))) {
            return res.status(400).json({
                success: false,
                message: "Answers must be an array of strings",
                data: null,
            });
        }
        // Validate 'correct_answer' as a number if it's provided
        if (correct_answer !== undefined && typeof correct_answer !== "number") {
            return res.status(400).json({
                success: false,
                message: "Correct answer must be a number (index)",
                data: null,
            });
        }
        // Validate 'eligibility_flag' as an array of strings if it's provided
        if (eligibility_flag &&
            (!Array.isArray(eligibility_flag) ||
                !eligibility_flag.every((item) => typeof item === "string"))) {
            return res.status(400).json({
                success: false,
                message: "Eligibility flag must be an array of strings",
                data: null,
            });
        }
        // Update fields if provided
        questionToUpdate.question = question || questionToUpdate.question;
        questionToUpdate.answers = answers || questionToUpdate.answers;
        questionToUpdate.correct_answer =
            correct_answer !== undefined
                ? correct_answer
                : questionToUpdate.correct_answer;
        questionToUpdate.subject = subject;
        questionToUpdate.eligibility_flag =
            eligibility_flag || questionToUpdate.eligibility_flag;
        questionToUpdate.score =
            score !== undefined ? score : questionToUpdate.score;
        const updatedQuestion = yield questionRepo.save(questionToUpdate);
        return res.status(200).json({
            success: true,
            message: "Question updated successfully",
            data: updatedQuestion,
        });
    }
    catch (error) {
        console.error("Error in updating question:", error);
        return res.status(500).json({
            success: false,
            message: "Error updating question",
            data: null,
        });
    }
});
exports.updateQuestion = updateQuestion;
const deleteQuestion = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const questionRepo = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    try {
        const question = yield questionRepo.findOne({ where: { id: Number(id) } });
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Question not found",
                data: null,
            });
        }
        yield questionRepo.remove(question);
        return res.status(200).json({
            success: true,
            message: "Question deleted successfully",
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error deleting question",
            data: null,
        });
    }
});
exports.deleteQuestion = deleteQuestion;
