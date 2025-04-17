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
exports.deleteChallengeHistory = exports.updateChallengeHistory = exports.addChallengeHistory = exports.getChallengeHistoryByUserId = exports.getAllChallengeHistories = void 0;
const data_source_1 = require("../data-source");
const ChallengeHistory_1 = require("../entities/ChallengeHistory");
const User_1 = require("../entities/User");
const Challenge_1 = require("../entities/Challenge");
const UserAnsweredQuestions_1 = require("../entities/UserAnsweredQuestions");
// Get all challenge histories
const getAllChallengeHistories = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = parseInt(req.query.userId); // Get userId from query param
    if (isNaN(userId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid or missing userId.",
            data: null,
        });
    }
    try {
        const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
        const answeredQuestionsRepo = data_source_1.AppDataSource.getRepository(UserAnsweredQuestions_1.UserAnsweredQuestions);
        // Fetch all challenge histories for the user
        const challengeHistories = yield challengeHistoryRepo.find({
            where: { user: { id: userId } },
            relations: ["challenge"],
        });
        // Categorize histories
        const categorized = {
            weekly: [],
            monthly: [],
            mega: [],
            special_event: [],
        };
        challengeHistories.forEach((history) => {
            var _a;
            const type = (_a = history.challenge) === null || _a === void 0 ? void 0 : _a.challenge_type;
            if (type && categorized.hasOwnProperty(type)) {
                categorized[type].push(history);
            }
        });
        // Fetch practice history (not related to ChallengeHistory)
        const practice = yield answeredQuestionsRepo.find({
            where: { user: { id: userId } },
            relations: ["question"],
            order: { answeredAt: "DESC" },
        });
        return res.status(200).json({
            success: true,
            message: "User challenge histories fetched successfully.",
            data: Object.assign(Object.assign({}, categorized), { practice }),
        });
    }
    catch (error) {
        console.error("Error in fetching challenge histories:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getAllChallengeHistories = getAllChallengeHistories;
// Get challenge history by User ID
const getChallengeHistoryByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    try {
        const userId = parseInt(req.params.userId, 10);
        // Fetch history for specific user
        const histories = yield challengeHistoryRepo.find({
            where: { user: { id: userId } },
            relations: ["challenge"], // Include related challenge data
        });
        if (!histories || histories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Challenge history for this user not found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: `Challenge histories for user ${userId} fetched successfully.`,
            data: histories,
        });
    }
    catch (error) {
        console.error("Error in fetching challenge history for user:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getChallengeHistoryByUserId = getChallengeHistoryByUserId;
// Add a new challenge history record
const addChallengeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    const userRepo = data_source_1.AppDataSource.getRepository(User_1.User);
    const challengeRepo = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    try {
        const { userId, challengeId, challenge_date, score, position, prize_money, } = req.body;
        // Check if user and challenge exist
        const user = yield userRepo.findOne({ where: { id: userId } });
        const challenge = yield challengeRepo.findOne({
            where: { id: challengeId },
        });
        if (!user || !challenge) {
            return res.status(404).json({
                success: false,
                message: "User or Challenge not found.",
                data: null,
            });
        }
        // Create and save new challenge history
        const newHistory = challengeHistoryRepo.create({
            user,
            challenge,
            challenge_date,
            score,
            position,
            prize_money,
        });
        yield challengeHistoryRepo.save(newHistory);
        return res.status(201).json({
            success: true,
            message: "Challenge history added successfully.",
            data: newHistory,
        });
    }
    catch (error) {
        console.error("Error in adding challenge history:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addChallengeHistory = addChallengeHistory;
// Update challenge history by ID
const updateChallengeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    try {
        const historyId = req.params.id;
        const { challenge_date, score, position, prize_money } = req.body;
        const challengeHistory = yield challengeHistoryRepo.findOne({
            where: { id: parseInt(historyId) },
            relations: ["challenge", "user"],
        });
        if (!challengeHistory) {
            return res.status(404).json({
                success: false,
                message: "Challenge history not found.",
                data: null,
            });
        }
        // Update fields
        challengeHistory.challenge_date =
            challenge_date || challengeHistory.challenge_date;
        challengeHistory.score = score || challengeHistory.score;
        challengeHistory.position = position || challengeHistory.position;
        challengeHistory.prize_money = prize_money || challengeHistory.prize_money;
        yield challengeHistoryRepo.save(challengeHistory);
        return res.status(200).json({
            success: true,
            message: "Challenge history updated successfully.",
            data: challengeHistory,
        });
    }
    catch (error) {
        console.error("Error in updating challenge history:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateChallengeHistory = updateChallengeHistory;
// Delete challenge history by ID
const deleteChallengeHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    try {
        const historyId = req.params.id;
        const challengeHistory = yield challengeHistoryRepo.findOne({
            where: { id: parseInt(historyId) },
        });
        if (!challengeHistory) {
            return res.status(404).json({
                success: false,
                message: "Challenge history not found.",
                data: null,
            });
        }
        yield challengeHistoryRepo.remove(challengeHistory);
        return res.status(200).json({
            success: true,
            message: "Challenge history deleted successfully.",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting challenge history:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteChallengeHistory = deleteChallengeHistory;
