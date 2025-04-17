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
exports.getChallengeQuestions = exports.getAllChallenges = exports.getUserChallengeResults = exports.setUserAmountBasedOnPrizeMoney = exports.getUserChallengeCompletionStatus = exports.getChallengeResults = exports.getGlobalBoard = exports.completeChallengeExam = exports.registerUserForChallenge = exports.getResults = exports.getNumberOfPracticeQuestionsSolved = exports.submitScore = exports.getPracticeQuestions = exports.deleteChallenge = exports.getUsersInChallenge = exports.updateChallenge = exports.createChallenge = void 0;
const data_source_1 = require("../data-source"); // Import the AppDataSource
const Challenge_1 = require("../entities/Challenge");
const ChallengeHistory_1 = require("../entities/ChallengeHistory");
const PrizeDetails_1 = require("../entities/PrizeDetails");
const QuestionBank_1 = require("../entities/QuestionBank");
const User_1 = require("../entities/User");
const typeorm_1 = require("typeorm");
const UserAnsweredQuestions_1 = require("../entities/UserAnsweredQuestions");
const Notifications_1 = require("../entities/Notifications");
const TransactionHistory_1 = require("../entities/TransactionHistory");
// Create a challenge with questions and prize details
const createChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { challenge_type, fee, deadline, active_status, questionIds, prizeDetailsIds, event_code, start_datetime, end_datetime, total_marks, total_seats, } = req.body;
    const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    const prizeRepository = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    const questionBankRepository = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    try {
        // Debug log for development
        console.log("Incoming Challenge Payload:", req.body);
        let prizeDetails = [];
        if (Array.isArray(prizeDetailsIds) && prizeDetailsIds.length > 0) {
            prizeDetails = yield prizeRepository.findByIds(prizeDetailsIds);
        }
        let questions = [];
        if (Array.isArray(questionIds) && questionIds.length > 0) {
            questions = yield questionBankRepository.findByIds(questionIds);
        }
        const newChallenge = new Challenge_1.Challenge();
        newChallenge.challenge_type = challenge_type;
        newChallenge.fee = typeof fee === "number" ? fee : 0;
        newChallenge.deadline = deadline ? new Date(deadline) : null;
        newChallenge.active_status = active_status !== null && active_status !== void 0 ? active_status : false;
        newChallenge.question_ids = questionIds || [];
        newChallenge.prizeDetails = prizeDetails;
        newChallenge.start_datetime = start_datetime
            ? new Date(start_datetime)
            : null;
        newChallenge.end_datetime = end_datetime ? new Date(end_datetime) : null;
        newChallenge.total_marks =
            typeof total_marks === "number" ? total_marks : 0;
        newChallenge.total_seats =
            typeof total_seats === "number" ? total_seats : 0;
        if (challenge_type === "special_event") {
            if (!event_code) {
                return res.status(400).json({
                    success: false,
                    message: "Special event challenge requires an event code.",
                });
            }
            newChallenge.event_code = event_code;
        }
        else {
            if (event_code) {
                return res.status(400).json({
                    success: false,
                    message: "Only special event challenges can have an event code.",
                });
            }
            newChallenge.event_code = "";
        }
        const savedChallenge = yield challengeRepository.save(newChallenge);
        return res.status(201).json({
            success: true,
            message: "Challenge created successfully",
            data: {
                challenge: savedChallenge,
                questions: questions,
            },
        });
    }
    catch (error) {
        console.error("Error creating challenge:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.createChallenge = createChallenge;
//Admin can update a challenge
const updateChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { challengeId, challenge_type, fee, deadline, active_status, questionIds, prizeDetailsIds, start_datetime, end_datetime, total_marks, total_seats, event_code, } = req.body;
    const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    const prizeRepository = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    const questionBankRepository = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    try {
        const challenge = yield challengeRepository.findOne({
            where: { id: challengeId },
        });
        if (!challenge) {
            return res.status(400).json({
                success: false,
                message: "Challenge not found",
                data: null,
            });
        }
        challenge.challenge_type = challenge_type || challenge.challenge_type;
        challenge.fee = typeof fee === "number" ? fee : challenge.fee;
        challenge.deadline = challenge.deadline;
        challenge.active_status = active_status !== null && active_status !== void 0 ? active_status : challenge.active_status;
        challenge.start_datetime = start_datetime
            ? new Date(start_datetime)
            : challenge.start_datetime;
        challenge.end_datetime = end_datetime
            ? new Date(end_datetime)
            : challenge.end_datetime;
        challenge.total_marks =
            typeof total_marks === "number" ? total_marks : challenge.total_marks;
        challenge.total_seats =
            typeof total_seats === "number" ? total_seats : challenge.total_seats;
        if (Array.isArray(questionIds) && questionIds.length > 0) {
            challenge.question_ids = questionIds;
        }
        if (Array.isArray(prizeDetailsIds) && prizeDetailsIds.length > 0) {
            const prizeDetails = yield prizeRepository.findByIds(prizeDetailsIds);
            challenge.prizeDetails = prizeDetails;
        }
        if (challenge_type === "special_event") {
            if (!event_code) {
                return res.status(400).json({
                    success: false,
                    message: "Special event challenge requires an event code.",
                });
            }
            challenge.event_code = event_code;
        }
        else {
            if (event_code) {
                return res.status(400).json({
                    success: false,
                    message: "Only special event challenges can have an event code.",
                });
            }
            challenge.event_code = "";
        }
        const updatedChallenge = yield challengeRepository.save(challenge);
        let questions = [];
        if (Array.isArray(questionIds) && questionIds.length > 0) {
            questions = yield questionBankRepository.findByIds(questionIds);
        }
        return res.status(200).json({
            success: true,
            message: "Challenge updated successfully",
            data: {
                challenge: updatedChallenge,
                questions: questions,
            },
        });
    }
    catch (error) {
        console.error("Error updating challenge:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateChallenge = updateChallenge;
// Controller to get the users registered for a specific challenge
const getUsersInChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { challengeId } = req.params; // Extract challengeId from route params
    try {
        // Find the challenge based on challengeId
        const challenge = yield data_source_1.AppDataSource.getRepository(Challenge_1.Challenge).findOne({
            where: { id: Number(challengeId) },
        });
        // If the challenge doesn't exist, return an error
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found",
            });
        }
        // Find all the users registered for this challenge
        const challengeHistories = yield data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory)
            .createQueryBuilder("history")
            .innerJoinAndSelect("history.user", "user") // Join with the User table
            .where("history.challengeId = :challengeId", { challengeId })
            .andWhere("history.completionStatus = :status", { status: "completed" }) // Optional filter by completion status
            .getMany();
        // Extract users from the result
        const users = challengeHistories.map((history) => history.user);
        // Return the list of users
        return res.status(200).json({
            success: true,
            message: "Users registered for the challenge",
            data: users,
        });
    }
    catch (error) {
        console.error("Error fetching users in challenge:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getUsersInChallenge = getUsersInChallenge;
// Admin can delete a challenge
const deleteChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { challengeId } = req.params;
    const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    try {
        const challenge = yield challengeRepository.findOne({
            where: { id: Number(challengeId) },
            relations: ["questions"], // Optional: If you want to delete the associated questions or manage relationships
        });
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found",
                data: null,
            });
        }
        // Remove the challenge from the database
        yield challengeRepository.remove(challenge);
        return res.status(200).json({
            success: true,
            message: "Challenge deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error deleting challenge:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteChallenge = deleteChallenge;
//practice question for a user
const getPracticeQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const answeredQuestionsRepository = data_source_1.AppDataSource.getRepository(UserAnsweredQuestions_1.UserAnsweredQuestions);
    const questionRepository = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User); // Get user repository
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract userId from the authenticated user (set by JWT middleware)
    const subjectId = req.params.subjectId
        ? parseInt(req.params.subjectId)
        : null; // Extract subjectId from URL (if provided)
    const questionCount = req.body.questionCount || 10; // Default to 2 if not provided
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is missing or invalid.",
            data: null,
        });
    }
    try {
        // Step 1: Get all answered question IDs for this user and store them in a Set for uniqueness
        console.log("Fetching answered questions for the user...");
        // Fetch all answered questions for the user
        const answeredQuestions = yield answeredQuestionsRepository.find({
            where: {
                user: { id: userId },
            },
            relations: ["question"], // Eager load the question relation
        });
        // Step 2: Create a Set of unique question IDs that the user has already answered
        console.log(`Found ${answeredQuestions.length} answered questions for user ${userId}`);
        const answeredQuestionIds = new Set();
        answeredQuestions.forEach((answeredQuestion) => {
            var _a;
            if ((_a = answeredQuestion.question) === null || _a === void 0 ? void 0 : _a.id) {
                console.log("Answered Question ID:", answeredQuestion.question.id);
                answeredQuestionIds.add(answeredQuestion.question.id);
            }
            else {
                console.log("No question found for answered question with ID:", answeredQuestion.id);
            }
        });
        // Step 3: Get practice questions that the user has not answered yet
        const queryOptions = {
            where: {
                eligibility_flag: (0, typeorm_1.Like)("%practice%"), // Ensure "practice" is in the array
            },
        };
        if (subjectId) {
            queryOptions.where["subject"] = { id: subjectId }; // Filter by subjectId if provided
        }
        // Fetch all questions where "practice" is present in the eligibility_flag array
        const allQuestions = yield questionRepository.find(queryOptions);
        console.log(allQuestions);
        if (!allQuestions || allQuestions.length === 0) {
            return res.status(404).json({
                success: false,
                message: "No practice questions found.",
                data: null,
            });
        }
        console.log(`Found ${allQuestions.length} practice questions.`);
        // Step 4: Filter out the questions that the user has already answered using the Set
        const unansweredQuestions = allQuestions.filter((question) => !answeredQuestionIds.has(question.id));
        console.log(`Remaining unanswered questions: ${unansweredQuestions.length}`);
        // Step 5: Check if there are enough unanswered questions (at least 2)
        if (unansweredQuestions.length < 1) {
            return res.status(404).json({
                success: false,
                message: "Not enough unique questions available.",
                data: null,
            });
        }
        // Step 6: Select the first 2 unanswered questions
        const selectedQuestions = unansweredQuestions.slice(0, questionCount);
        console.log("Selected practice questions:", selectedQuestions);
        // Step 7: Save these questions as answered for the user in UserAnsweredQuestions
        const user = yield userRepository.findOne({ where: { id: userId } });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
                data: null,
            });
        }
        // Prepare UserAnsweredQuestions with the full User and Question entities
        const userAnsweredQuestions = selectedQuestions.map((question) => ({
            user: user, // Full User entity
            question: question, // Full QuestionBank entity
        }));
        // Save the answered questions
        yield answeredQuestionsRepository.save(userAnsweredQuestions);
        // Step 9: Create a new practice challenge instance for this session
        const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
        const challengeHistoryRepository = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
        // Create new practice challenge per session
        const practiceChallenge = challengeRepository.create({
            challenge_type: "practice",
            fee: 0,
            active_status: true,
            registered_users: 1,
            result_finalization: false,
            event_code: "practice_" + Date.now(), // Unique event code
            question_ids: selectedQuestions.map((q) => q.id),
            start_datetime: new Date(),
            end_datetime: new Date(),
            users: [user], // Register the current user
        });
        yield challengeRepository.save(practiceChallenge);
        // Log the attempt in challenge history
        const challengeHistory = challengeHistoryRepository.create({
            user,
            challenge: practiceChallenge,
            challenge_date: new Date(),
            score: 0,
            prize_money: 0,
            completionStatus: "completed",
            prize_money_distribution_status: false,
        });
        yield challengeHistoryRepository.save(challengeHistory);
        return res.status(200).json({
            success: true,
            message: "Practice questions fetched successfully.",
            data: selectedQuestions,
        });
    }
    catch (error) {
        console.error("Error fetching practice questions:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching practice questions.",
            data: null,
        });
    }
});
exports.getPracticeQuestions = getPracticeQuestions;
//submit per practice question score
const submitScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const answeredQuestionsRepository = data_source_1.AppDataSource.getRepository(UserAnsweredQuestions_1.UserAnsweredQuestions);
    const { questionId, score } = req.body;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Extract userId from the authenticated user (set by JWT middleware)
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is missing or invalid.",
            data: null,
        });
    }
    if (!questionId || score === undefined || score === null) {
        return res.status(400).json({
            success: false,
            message: "Question ID and score are required.",
            data: null,
        });
    }
    try {
        // Step 1: Check if the user has answered the question
        const answeredQuestion = yield answeredQuestionsRepository.findOne({
            where: { user: { id: userId }, question: { id: questionId } },
        });
        if (!answeredQuestion) {
            return res.status(404).json({
                success: false,
                message: "This question has not been answered by the user.",
                data: null,
            });
        }
        // Step 2: Update the score for the answered question
        answeredQuestion.score = score;
        // Save the updated score
        yield answeredQuestionsRepository.save(answeredQuestion);
        // Step 3: Return the updated entry
        return res.status(200).json({
            success: true,
            message: "Score submitted successfully.",
            data: answeredQuestion, // Return the updated answered question entry
        });
    }
    catch (error) {
        console.error("Error submitting score:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while submitting the score.",
            data: null,
        });
    }
});
exports.submitScore = submitScore;
//get number of practice questions solved by a specific user
const getNumberOfPracticeQuestionsSolved = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "User ID is missing or invalid.",
            data: null,
        });
    }
    try {
        const answeredQuestionsRepo = data_source_1.AppDataSource.getRepository(UserAnsweredQuestions_1.UserAnsweredQuestions);
        // Count distinct questions answered by the user
        const count = yield answeredQuestionsRepo.count({
            where: { user: { id: Number(userId) } },
            relations: ["question"],
        });
        return res.status(200).json({
            success: true,
            message: "Number of practice questions solved fetched successfully.",
            data: { count },
        });
    }
    catch (error) {
        console.error("Error fetching number of practice questions solved:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getNumberOfPracticeQuestionsSolved = getNumberOfPracticeQuestionsSolved;
// // Calculate positions and prizes for a challenge
// export const calculatePositionAndPrizes = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { challengeId } = req.body;
//   const challengeRepository = AppDataSource.getRepository(Challenge);
//   const prizeDetailsRepository = AppDataSource.getRepository(PrizeDetails);
//   const challengeHistoryRepository =
//     AppDataSource.getRepository(ChallengeHistory);
//   try {
//     const challenge = await challengeRepository.findOne({
//       where: { id: challengeId },
//       relations: ["challengeHistory"],
//     });
//     if (!challenge || !challenge.challengeHistory) {
//       return res.status(400).json({
//         success: false,
//         message: "Challenge or challenge history not found",
//         data: null,
//       });
//     }
//     // Sort challenge history by score in descending order
//     const sortedHistory = challenge.challengeHistory.sort(
//       (a: any, b: any) => b.score - a.score
//     );
//     // Assign positions and prizes based on sorted scores
//     for (let index = 0; index < sortedHistory.length; index++) {
//       const history = sortedHistory[index];
//       history.position = `${index + 1}th`;
//       // Find prize money based on position
//       const prize = await prizeDetailsRepository.findOne({
//         where: { position: history.position },
//       });
//       history.prize_money = prize ? prize.prize_money : 0;
//       await challengeHistoryRepository.save(history); // Save the updated history
//     }
//     return res.status(200).json({
//       success: true,
//       message: "Positions and prizes calculated successfully",
//       data: null,
//     });
//   } catch (error: any) {
//     console.error("Error in calculating positions and prizes:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// };
// Get results for a specific challenge (by user, period, etc.)
const getResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, challengeId, period } = req.params; // 'week', 'month', 'year', etc.
    const userIdNum = parseInt(userId, 10);
    const challengeIdNum = parseInt(challengeId, 10);
    if (isNaN(userIdNum) || isNaN(challengeIdNum)) {
        return res.status(400).json({
            success: false,
            message: "Invalid userId or challengeId",
            data: null,
        });
    }
    const challengeHistoryRepository = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    try {
        const history = yield challengeHistoryRepository.find({
            where: {
                user: { id: userIdNum },
                challenge: { id: challengeIdNum },
                challenge_date: calculatePeriodDate(period), // Call the helper method correctly
            },
        });
        return res.status(200).json({
            success: true,
            message: "Challenge results fetched successfully",
            data: history,
        });
    }
    catch (error) {
        console.error("Error in fetching results:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getResults = getResults;
// Helper method to calculate the date for a specific period
const calculatePeriodDate = (period) => {
    const currentDate = new Date();
    let targetDate = new Date();
    if (period === "week") {
        targetDate.setDate(currentDate.getDate() - 7); // 1 week ago
    }
    else if (period === "month") {
        targetDate.setMonth(currentDate.getMonth() - 1); // 1 month ago
    }
    else if (period === "year") {
        targetDate.setFullYear(currentDate.getFullYear() - 1); // 1 year ago
    }
    return targetDate;
};
//register in a challenge
const registerUserForChallenge = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, challengeId, event_code } = req.body;
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    const challengeHistoryRepository = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    try {
        // Find the user and challenge
        const user = yield userRepository.findOne({ where: { id: userId } });
        const challenge = yield challengeRepository.findOne({
            where: { id: challengeId },
            relations: ["users"], // Make sure to load the 'users' relationship
        });
        // Check if user or challenge is not found
        if (!user || !challenge) {
            return res.status(400).json({
                success: false,
                message: "Invalid user or challenge",
                data: null,
            });
        }
        // Check if the challenge is of type 'special_event'
        if (challenge.challenge_type === "special_event" &&
            challenge.event_code !== event_code) {
            return res.status(400).json({
                success: false,
                message: "Invalid event code for special event challenge",
                data: null,
            });
        }
        // Check if the user is already registered for the challenge
        if (challenge.users && challenge.users.some((u) => u.id === userId)) {
            return res.status(400).json({
                success: false,
                message: "User is already registered for this challenge.",
                data: null,
            });
        }
        // Add the user to the challenge's 'users' list (many-to-many relationship)
        if (!challenge.users) {
            challenge.users = [];
        }
        challenge.users.push(user);
        // Increment the registered users count
        challenge.registered_users = (challenge.registered_users || 0) + 1;
        // Save the updated challenge
        yield challengeRepository.save(challenge);
        // Add the user to the challenge's 'users' list (many-to-many relationship)
        if (!challenge.users) {
            challenge.users = [];
        }
        challenge.users.push(user);
        // Increment the registered users count
        challenge.registered_users = (challenge.registered_users || 0) + 1;
        // Save the updated challenge
        yield challengeRepository.save(challenge);
        // Create an entry in the ChallengeHistory table
        const challengeHistory = new ChallengeHistory_1.ChallengeHistory();
        challengeHistory.user = user;
        challengeHistory.challenge = challenge;
        challengeHistory.challenge_date = new Date(); // Date when they registered for the challenge
        challengeHistory.completionStatus = "not_started"; // Initially set as "not_started"
        challengeHistory.score = 0; // Initial score is 0, can be updated after completion
        challengeHistory.position = "N/A"; // Default position until challenge is completed
        challengeHistory.prize_money = 0; // Set prize money as 0 initially
        // Save ChallengeHistory record
        yield challengeHistoryRepository.save(challengeHistory);
        const transactionHistoryRepository = data_source_1.AppDataSource.getRepository(TransactionHistory_1.TransactionHistory);
        // Save a transaction if the challenge has a fee
        if (challenge.fee && challenge.fee > 0) {
            const transaction = transactionHistoryRepository.create({
                user: user,
                transaction_type: "Challenge Registration",
                amount: challenge.fee,
                transaction_status: "Completed",
                transaction_date: new Date(),
                description: `Registered for ${challenge.challenge_type} challenge (ID: ${challenge.id})`,
            });
            yield transactionHistoryRepository.save(transaction);
        }
        // Fetch and return the updated user list for the challenge
        const updatedChallenge = yield challengeRepository.findOne({
            where: { id: challengeId },
            relations: ["users"], // Fetch the users associated with the challenge
        });
        // Return the updated user list as part of the response
        return res.status(200).json({
            success: true,
            message: "User registered for the challenge successfully",
            data: updatedChallenge === null || updatedChallenge === void 0 ? void 0 : updatedChallenge.users,
        });
    }
    catch (error) {
        console.error("Error in registering user for challenge:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.registerUserForChallenge = registerUserForChallenge;
//complete a exam for user
const completeChallengeExam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, challengeId, score, correctAnswers } = req.body;
    const userRepository = data_source_1.AppDataSource.getRepository(User_1.User);
    const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    const challengeHistoryRepository = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
    try {
        const user = yield userRepository.findOne({ where: { id: userId } });
        const challenge = yield challengeRepository.findOne({
            where: { id: challengeId },
            relations: ["challengeHistory"],
        });
        if (!user || !challenge) {
            return res.status(400).json({
                success: false,
                message: "Invalid user or challenge",
                data: null,
            });
        }
        const challengeHistory = yield challengeHistoryRepository.findOne({
            where: { user: { id: userId }, challenge: { id: challengeId } },
        });
        if (!challengeHistory) {
            return res.status(200).json({
                success: true,
                message: "Please register for the challenge first.",
                data: null,
            });
        }
        if (challengeHistory.completionStatus === "completed") {
            return res.status(400).json({
                success: false,
                message: "You have already completed this challenge.",
                data: null,
            });
        }
        // ✅ Update challenge history with completion info
        challengeHistory.completionStatus = "completed";
        challengeHistory.score = score;
        challengeHistory.correctAnswers = correctAnswers || 0; // <-- NEW FIELD
        yield challengeHistoryRepository.save(challengeHistory);
        yield challengeRepository.save(challenge); // Optional
        return res.status(200).json({
            success: true,
            message: "Challenge completed successfully and history updated",
            data: challengeHistory,
        });
    }
    catch (error) {
        console.error("Error completing challenge:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.completeChallengeExam = completeChallengeExam;
// export const getGlobalBoard = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const { result_finalization, monthly_eligibility, weekly_eligibility } =
//     req.body;
//   try {
//     const currentDate = new Date();
//     const currentYear = currentDate.getFullYear();
//     const currentMonth = currentDate.getMonth();
//     // Fetch latest prize details for the current month where global_board is true
//     const prizeDetailsRepo = AppDataSource.getRepository(PrizeDetails);
//     const latestPrizeDetails = await prizeDetailsRepo
//       .createQueryBuilder("prizeDetails")
//       .where(
//         `EXTRACT(YEAR FROM prizeDetails.updatedAt) = :year AND EXTRACT(MONTH FROM prizeDetails.updatedAt) = :month`,
//         { year: currentYear, month: currentMonth + 1 } // Using +1 as JavaScript months are 0-indexed
//       )
//       .andWhere("prizeDetails.global_board = :globalBoard", {
//         globalBoard: true,
//       })
//       .orderBy("prizeDetails.updatedAt", "DESC")
//       .getOne();
//     if (!latestPrizeDetails) {
//       return res.status(400).json({
//         success: false,
//         message:
//           "No prize details available for the global board in the current month.",
//       });
//     }
//     // Group valid monthly & weekly challenges from the current month
//     const challengeHistories = await AppDataSource.getRepository(
//       ChallengeHistory
//     ).find({
//       where: { completionStatus: "completed" },
//       relations: ["user", "challenge", "challenge.prizeDetails"],
//     });
//     const filteredHistories = challengeHistories.filter((history) => {
//       if (!history.challenge || !history.challenge_date) return false;
//       const type = history.challenge.challenge_type;
//       const date = new Date(history.challenge_date);
//       return (
//         (type === "monthly" || type === "weekly") &&
//         date.getFullYear() === currentYear &&
//         date.getMonth() === currentMonth
//       );
//     });
//     const monthlyMap = new Map<number, ChallengeHistory[]>();
//     const weeklyMap = new Map<number, ChallengeHistory[]>();
//     const eligibleUserScores = new Map<
//       number,
//       {
//         user: User;
//         totalScore: number;
//         challengeCount: number;
//         totalPrize: number;
//         averagePrizeMoney: number;
//         challenge: Challenge;
//         history: ChallengeHistory;
//       }
//     >();
//     // Process each challenge history for scoring and eligibility
//     for (const history of filteredHistories) {
//       const challenge = history.challenge;
//       const user = history.user;
//       if (!challenge || !user) continue;
//       const userId = user.id;
//       const type = challenge.challenge_type;
//       if (type === "monthly") {
//         if (!monthlyMap.has(userId)) monthlyMap.set(userId, []);
//         monthlyMap.get(userId)!.push(history);
//       } else if (type === "weekly") {
//         if (!weeklyMap.has(userId)) weeklyMap.set(userId, []);
//         weeklyMap.get(userId)!.push(history);
//       }
//     }
//     // Loop through users and check eligibility
//     for (const history of filteredHistories) {
//       const challenge = history.challenge;
//       const user = history.user;
//       if (!challenge || !user) continue;
//       const userId = user.id;
//       const monthlyCount = monthlyMap.get(userId)?.length ?? 0;
//       const weeklyCount = weeklyMap.get(userId)?.length ?? 0;
//       if (
//         monthlyCount < monthly_eligibility ||
//         weeklyCount < weekly_eligibility
//       )
//         continue;
//       if (challenge.result_finalization && result_finalization) continue;
//       const score = history.score ?? 0;
//       const prizeMoney = history.prize_money ?? 0;
//       const currentScore = eligibleUserScores.get(userId) || {
//         user,
//         totalScore: 0,
//         challengeCount: 0,
//         totalPrize: 0,
//         averagePrizeMoney: 0,
//         challenge,
//         history,
//       };
//       currentScore.totalScore += score;
//       currentScore.totalPrize += prizeMoney;
//       currentScore.challengeCount += 1;
//       eligibleUserScores.set(userId, currentScore);
//     }
//     // Prepare final leaderboard with prize distribution from latestPrizeDetails
//     const sortedUsers = Array.from(eligibleUserScores.values())
//       .map((user) => {
//         const averageScore = user.totalScore / user.challengeCount;
//         const averagePrizeMoney = user.totalPrize / user.challengeCount;
//         return {
//           ...user,
//           averageScore,
//           averagePrizeMoney,
//         };
//       })
//       .sort((a, b) => b.averageScore - a.averageScore);
//     // Prepare final data for response with prize positions and prize money
//     const finalLeaderboard = sortedUsers.map((user, index) => {
//       // Fetch prize positions from the latest prize details
//       const prizePositions = latestPrizeDetails.prize_positions || [];
//       const position = `Top ${index + 1}`;
//       const prize = prizePositions[index] || { position, prize_money: 50 };
//       return {
//         userId: user.user.id,
//         userName: user.user.full_name,
//         averageScore: user.averageScore,
//         averagePrizeMoney: user.averagePrizeMoney,
//         position: prize.position, // Only in response, not in history
//         prize_money: prize.prize_money, // Only in response, not in history
//       };
//     });
//     return res.status(200).json({
//       success: true,
//       message: "Global board for current month (monthly + weekly challenges).",
//       data: finalLeaderboard,
//     });
//   } catch (error) {
//     console.error("Error fetching global board:", error);
//     return res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// };
const getGlobalBoard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    const { result_finalization, monthly_eligibility, weekly_eligibility } = req.body;
    try {
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        const currentMonth = currentDate.getMonth();
        // Fetch the latest prize details for the current month where global_board is true
        const prizeDetailsRepo = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
        const latestPrizeDetails = yield prizeDetailsRepo
            .createQueryBuilder("prizeDetails")
            .where(`EXTRACT(YEAR FROM prizeDetails.updatedAt) = :year AND EXTRACT(MONTH FROM prizeDetails.updatedAt) = :month`, { year: currentYear, month: currentMonth + 1 })
            .andWhere("prizeDetails.global_board = :globalBoard", {
            globalBoard: true,
        })
            .orderBy("prizeDetails.updatedAt", "DESC")
            .getOne();
        if (!latestPrizeDetails) {
            return res.status(400).json({
                success: false,
                message: "No prize details available for the global board in the current month.",
            });
        }
        // Step 2: Fetch all challenge histories for monthly, weekly, and mega challenges (completed challenges)
        const challengeHistories = yield data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory).find({
            where: { completionStatus: "completed" },
            relations: ["user", "challenge", "challenge.prizeDetails"],
        });
        // Filter valid monthly, weekly, and mega challenges for the current month
        const filteredHistories = challengeHistories.filter((history) => {
            if (!history.challenge || !history.challenge_date)
                return false;
            const type = history.challenge.challenge_type;
            const date = new Date(history.challenge_date);
            // Ensure we are only looking at monthly, weekly, and mega challenges for the current month
            return ((type === "monthly" || type === "weekly" || type === "mega") &&
                date.getFullYear() === currentYear &&
                date.getMonth() === currentMonth);
        });
        // Step 3: Group challenge histories by user
        const monthlyMap = new Map();
        const weeklyMap = new Map();
        const eligibleUserScores = new Map();
        for (const history of filteredHistories) {
            const challenge = history.challenge;
            const user = history.user;
            if (!challenge || !user)
                continue;
            const userId = user.id;
            const type = challenge.challenge_type;
            if (type === "monthly") {
                if (!monthlyMap.has(userId))
                    monthlyMap.set(userId, []);
                monthlyMap.get(userId).push(history);
            }
            else if (type === "weekly") {
                if (!weeklyMap.has(userId))
                    weeklyMap.set(userId, []);
                weeklyMap.get(userId).push(history);
            }
        }
        // Step 4: Loop through users and calculate score and prize eligibility
        for (const history of filteredHistories) {
            const challenge = history.challenge;
            const user = history.user;
            if (!challenge || !user)
                continue;
            const userId = user.id;
            const monthlyCount = (_b = (_a = monthlyMap.get(userId)) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 0;
            const weeklyCount = (_d = (_c = weeklyMap.get(userId)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0;
            // Eligibility is based on monthly and weekly challenges, not mega challenges
            if (monthlyCount < monthly_eligibility ||
                weeklyCount < weekly_eligibility)
                continue;
            // If the challenge is not finalized and we are not finalizing results, skip
            if (challenge.result_finalization && result_finalization)
                continue;
            let score = 0;
            let prizeMoney = 0;
            // Determine the score distribution based on challenge type
            switch (challenge.challenge_type) {
                case "practice":
                    score = (_e = history.score) !== null && _e !== void 0 ? _e : 0;
                    prizeMoney = 0; // Practice challenges may not have prize money
                    break;
                case "mega":
                    score = ((_f = history.score) !== null && _f !== void 0 ? _f : 0) * 10; // Mega challenge: 10 points per correct answer
                    prizeMoney = (_g = history.prize_money) !== null && _g !== void 0 ? _g : 0;
                    break;
                case "monthly":
                    score = ((_h = history.score) !== null && _h !== void 0 ? _h : 0) * 5; // Monthly challenge: 5 points per correct answer
                    prizeMoney = (_j = history.prize_money) !== null && _j !== void 0 ? _j : 0;
                    break;
                case "weekly":
                    score = ((_k = history.score) !== null && _k !== void 0 ? _k : 0) * 2; // Weekly challenge: 2 points per correct answer
                    prizeMoney = (_l = history.prize_money) !== null && _l !== void 0 ? _l : 0;
                    break;
            }
            // Calculate the total score for the user including mega challenge points
            const currentScore = eligibleUserScores.get(userId) || {
                user,
                totalScore: 0,
                challengeCount: 0,
                totalPrize: 0,
                averagePrizeMoney: 0,
                challenge,
                history,
            };
            currentScore.totalScore += score;
            currentScore.totalPrize += prizeMoney;
            currentScore.challengeCount += 1;
            eligibleUserScores.set(userId, currentScore);
        }
        // Step 5: Sort users by score and prepare final leaderboard
        const sortedUsers = Array.from(eligibleUserScores.values())
            .map((user) => {
            const averageScore = user.totalScore / user.challengeCount;
            const averagePrizeMoney = user.totalPrize / user.challengeCount;
            return Object.assign(Object.assign({}, user), { averageScore,
                averagePrizeMoney });
        })
            .sort((a, b) => b.averageScore - a.averageScore);
        // Step 6: Assign prize positions and prize money
        const finalLeaderboard = sortedUsers.map((user, index) => {
            const prizePositions = latestPrizeDetails.prize_positions || [];
            const position = `Top ${index + 1}`;
            const prize = prizePositions[index] || { position, prize_money: 50 };
            return {
                userId: user.user.id,
                userName: user.user.full_name,
                averageScore: user.averageScore,
                averagePrizeMoney: user.averagePrizeMoney,
                position: prize.position, // Only in response, not in history
                prize_money: prize.prize_money, // Only in response, not in history
            };
        });
        // Return the final leaderboard
        return res.status(200).json({
            success: true,
            message: "Global board for current month (monthly + weekly + mega challenges).",
            data: finalLeaderboard,
        });
    }
    catch (error) {
        console.error("Error fetching global board:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getGlobalBoard = getGlobalBoard;
//Result for particular challenge
const getChallengeResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const { challengeId } = req.params; // Get the challengeId from the URL params
    try {
        // Find the challenge by ID
        const challenge = yield data_source_1.AppDataSource.getRepository(Challenge_1.Challenge).findOne({
            where: { id: Number(challengeId) },
            relations: ["challengeHistory", "prizeDetails", "challengeHistory.user"],
        });
        if (!challenge) {
            return res.status(404).json({ message: "Challenge not found." });
        }
        // Find all completed ChallengeHistories for the given challenge
        const challengeHistories = ((_a = challenge.challengeHistory) === null || _a === void 0 ? void 0 : _a.filter((history) => history.completionStatus === "completed")) || [];
        // Sort the histories by score in descending order
        const sortedHistories = challengeHistories.sort((a, b) => { var _a, _b; return ((_a = b.score) !== null && _a !== void 0 ? _a : 0) - ((_b = a.score) !== null && _b !== void 0 ? _b : 0); });
        // Get the prize positions for this challenge
        const prizeDetails = ((_c = (_b = challenge.prizeDetails) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.prize_positions) || [];
        // Loop through the sorted histories to assign positions and prize money
        sortedHistories.forEach((history, index) => {
            const user = history.user;
            const position = `Top ${index + 1}`;
            const prize = prizeDetails[index] || { position, prize_money: 0 }; // Default prize if no prize position found
            // Assign position and prize money
            history.position = prize.position;
            history.prize_money = prize.prize_money;
            // Log the assigned position and prize money
            console.log(`Assigned ${position} to user ${user === null || user === void 0 ? void 0 : user.full_name} with prize money: ${prize.prize_money}`);
        });
        // After assigning positions and prize money, save the updated challenge histories back to the database
        yield data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory).save(challengeHistories);
        // Return the challenge results
        return res.status(200).json({
            success: true,
            message: `Challenge results for challenge ${challengeId}.`,
            data: sortedHistories.map((history) => {
                var _a, _b;
                return ({
                    userId: (_a = history.user) === null || _a === void 0 ? void 0 : _a.id,
                    userName: (_b = history.user) === null || _b === void 0 ? void 0 : _b.full_name,
                    score: history.score,
                    position: history.position,
                    prize_money: history.prize_money,
                });
            }),
        });
    }
    catch (error) {
        console.error("Error fetching challenge results:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getChallengeResults = getChallengeResults;
//win a laptop eligibility
const getUserChallengeCompletionStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.params; // Extract userId from the route parameters
    //const { challengeTypes } = req.body; // Extract challenge types from the request body
    try {
        const challengeTypes = ["weekly", "monthly", "mega", "practice"];
        // Validate the challengeTypes (should be an array of valid types excluding 'practice')
        const validChallengeTypes = ["weekly", "monthly", "mega", "practice"];
        if (!Array.isArray(challengeTypes) ||
            !challengeTypes.every((type) => validChallengeTypes.includes(type))) {
            return res.status(400).json({ message: "Invalid challenge types." });
        }
        // Get the current year
        const currentYear = new Date().getFullYear();
        // Find completed challenges based on challenge type and userId
        const completedChallenges = yield data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory)
            .createQueryBuilder("history")
            .innerJoinAndSelect("history.challenge", "challenge") // Join with Challenge table
            .where("history.userId = :userId", { userId })
            .andWhere("history.completionStatus = :status", { status: "completed" })
            .andWhere("EXTRACT(YEAR FROM history.challenge_date) = :currentYear", {
            currentYear,
        })
            .andWhere("challenge.challenge_type IN (:...challengeTypes)", {
            challengeTypes,
        })
            .getMany();
        // Count how many challenges the user has completed per challenge type
        const challengeCountByType = completedChallenges.reduce((acc, history) => {
            var _a;
            const challengeType = (_a = history.challenge) === null || _a === void 0 ? void 0 : _a.challenge_type;
            if (challengeType) {
                acc[challengeType] = (acc[challengeType] || 0) + 1;
            }
            return acc;
        }, {});
        // Get the total number of practice problem exams completed by the user
        const answeredQuestions = yield data_source_1.AppDataSource.getRepository(UserAnsweredQuestions_1.UserAnsweredQuestions)
            .createQueryBuilder("answered")
            .where("answered.userId = :userId", { userId })
            .getMany();
        // Assuming each practice problem exam consists of 2 questions
        const totalPracticeExams = answeredQuestions.length;
        // Create response object with structured data for each challenge type
        const responseData = {
            practice_questions: totalPracticeExams, // Practice problem exams count
            weekly: challengeCountByType["weekly"] || 0, // Weekly challenge count
            monthly: challengeCountByType["monthly"] || 0, // Monthly challenge count
            mega: challengeCountByType["mega"] || 0, // Mega challenge count
            practice: challengeCountByType["practice"] || 0,
        };
        // Return the response with the success message and data
        return res.status(200).json({
            success: true,
            message: "Challenge completion status for the current year.",
            data: responseData, // Return the structured data
        });
    }
    catch (error) {
        console.error("Error checking completed challenges:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
});
exports.getUserChallengeCompletionStatus = getUserChallengeCompletionStatus;
// Function to set user amount based on the prize money in the ChallengeHistory
const setUserAmountBasedOnPrizeMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { challengeId } = req.params; // Extract challengeId from the request body
    try {
        // Validate the provided challengeId
        if (!challengeId) {
            return res.status(400).json({ message: "Challenge ID is required." });
        }
        // Find the challenge by ID and check if result_finalization is true
        const challenge = yield data_source_1.AppDataSource.getRepository(Challenge_1.Challenge)
            .createQueryBuilder("challenge")
            .where("challenge.id = :challengeId", { challengeId })
            .andWhere("challenge.result_finalization = :resultFinalization", {
            resultFinalization: true,
        })
            .getOne();
        console.log("challengeId found :", challengeId);
        if (!challenge) {
            return res
                .status(404)
                .json({ message: "Challenge not found or not finalized." });
        }
        // Find all users related to the challenge and retrieve their prize_money from ChallengeHistory
        const challengeHistories = yield data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory)
            .createQueryBuilder("history")
            .innerJoinAndSelect("history.user", "user") // Join with User table
            .where("history.challengeId = :challengeId", { challengeId })
            .andWhere("history.completionStatus = :status", { status: "completed" }) // Ensure only completed challenges
            .getMany();
        if (challengeHistories.length === 0) {
            return res.status(404).json({
                message: "No completed challenge history found for this challenge.",
            });
        }
        // Set the user's total_prize_money_received to prize_money from ChallengeHistory
        const userPromises = challengeHistories.map((history) => __awaiter(void 0, void 0, void 0, function* () {
            const user = history.user;
            if (user && history.prize_money) {
                // Check if the prize money has already been distributed
                if (history.prize_money_distribution_status === true) {
                    console.log(`Prize money has already been distributed for User ID: ${user.id}`);
                    return; // Exit the function if the prize money has already been distributed
                }
                // Ensure the prize_money is rounded to two decimal places before saving
                const roundedPrizeMoney = parseFloat(history.prize_money.toFixed(2));
                // Log the user's ID, prize money, and their total prize money before updating
                console.log(`User ID: ${user.id}`);
                console.log(`Prize Money: ${history.prize_money}`);
                console.log(`Previous Total Prize Money: ${user.total_prize_money_received}`);
                // Ensure user.total_prize_money_received is a number (use 0 if null or undefined)
                let newTotalPrizeMoney = Number(user.total_prize_money_received) || 0; // Convert to number explicitly
                // Add the prize money to the user's current total
                newTotalPrizeMoney += roundedPrizeMoney;
                // Check if newTotalPrizeMoney is a valid number before attempting to round it
                if (!isNaN(newTotalPrizeMoney)) {
                    // Round the result to two decimal places
                    user.total_prize_money_received = parseFloat(newTotalPrizeMoney.toFixed(2));
                }
                else {
                    console.error(`Invalid total prize money for user ID: ${user.id}`);
                }
                // Log the new total prize money after the update
                console.log(`Updated Total Prize Money: ${user.total_prize_money_received}`);
                // Set the prize_money_distribution_status to true after distribution
                history.prize_money_distribution_status = true;
                // Create a notification message for the user based on their position and prize money
                const notificationMessage = `Congratulations! You've won ${roundedPrizeMoney} as a reward for your ${history.position} place in the challenge!`;
                // Create and save the notification for the user
                const notification = new Notifications_1.Notification();
                notification.user = user; // Set the user related to this notification
                notification.message = notificationMessage; // Set the notification message
                notification.date = new Date(); // Set the current date and time
                // Save the notification to the database
                yield data_source_1.AppDataSource.getRepository(Notifications_1.Notification).save(notification);
                // Save the updated user entity to the database
                yield data_source_1.AppDataSource.getRepository(User_1.User).save(user);
                yield data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory).save(history);
            }
        }));
        // Wait for all user updates (total_prize_money_received) to complete
        yield Promise.all(userPromises);
        return res.status(200).json({
            success: true,
            message: `Total prize money successfully updated for ${challengeHistories.length} users.`,
        });
    }
    catch (error) {
        console.error("Error setting total prize money:", error);
        return res.status(500).json({ message: "An unexpected error occurred." });
    }
});
exports.setUserAmountBasedOnPrizeMoney = setUserAmountBasedOnPrizeMoney;
// Controller method to fetch user challenge results
const getUserChallengeResults = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { userId } = req.params;
    try {
        // Fetch the user's challenge history for weekly, monthly, and mega challenges using AppDataSource
        const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
        const challengeResults = yield challengeHistoryRepo.find({
            where: { user: { id: Number(userId) } },
            relations: ["challenge"], // Fetch the associated challenge entity for each record
        });
        // Fetch the user's answers to practice challenges using AppDataSource
        const userAnsweredQuestionsRepo = data_source_1.AppDataSource.getRepository(UserAnsweredQuestions_1.UserAnsweredQuestions);
        const practiceResults = yield userAnsweredQuestionsRepo.find({
            where: { user: { id: Number(userId) } },
            relations: ["question"], // If you need to fetch related question details
        });
        // Initialize arrays to hold categorized results
        const weeklyResults = [];
        const monthlyResults = [];
        const megaResults = [];
        const practiceResultsArray = [];
        let practiceChallengeCount = 0;
        // Categorize the challenge results
        for (const challengeHistory of challengeResults) {
            const challengeType = (_a = challengeHistory.challenge) === null || _a === void 0 ? void 0 : _a.challenge_type;
            if (challengeType === "weekly") {
                weeklyResults.push({
                    position: challengeHistory.position,
                    score: challengeHistory.score,
                    prize_money: challengeHistory.prize_money,
                });
            }
            else if (challengeType === "monthly") {
                monthlyResults.push({
                    position: challengeHistory.position,
                    score: challengeHistory.score,
                    prize_money: challengeHistory.prize_money,
                });
            }
            else if (challengeType === "mega") {
                megaResults.push({
                    position: challengeHistory.position,
                    score: challengeHistory.score,
                    prize_money: challengeHistory.prize_money,
                });
            }
            else if (challengeType === "practice") {
                practiceChallengeCount++;
            }
        }
        // Store practice challenge results
        for (const answeredQuestion of practiceResults) {
            practiceResultsArray.push({
                question: (_b = answeredQuestion.question) === null || _b === void 0 ? void 0 : _b.id,
                score: answeredQuestion.score,
                answeredAt: answeredQuestion.answeredAt,
            });
        }
        // Return the categorized results in the specified format
        return res.json({
            weekly: weeklyResults,
            monthly: monthlyResults,
            mega: megaResults,
            practice: {
                answeredQuestions: practiceResultsArray,
                totalPracticeChallenges: practiceChallengeCount,
            },
        });
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: "Something went wrong while fetching the data." });
    }
});
exports.getUserChallengeResults = getUserChallengeResults;
//get all the challenges and their details
const getAllChallenges = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const challengeRepo = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
        const challengeHistoryRepo = data_source_1.AppDataSource.getRepository(ChallengeHistory_1.ChallengeHistory);
        // 1. Fetch all challenges with related users
        const challenges = yield challengeRepo.find({
            relations: ["users"],
        });
        const challengeIds = challenges.map((c) => c.id);
        // 2. Fetch challenge histories with their related users and challenges
        const challengeHistories = yield challengeHistoryRepo
            .createQueryBuilder("history")
            .innerJoinAndSelect("history.user", "user")
            .innerJoinAndSelect("history.challenge", "challenge")
            .where("history.challengeId IN (:...challengeIds)", { challengeIds })
            .getMany();
        const usersByChallenge = {};
        for (const history of challengeHistories) {
            const challengeId = (_a = history.challenge) === null || _a === void 0 ? void 0 : _a.id;
            if (typeof challengeId === "number" && history.user) {
                if (!usersByChallenge[challengeId]) {
                    usersByChallenge[challengeId] = [];
                }
                usersByChallenge[challengeId].push(Object.assign(Object.assign({}, history.user), { challenge_completion_status: (_b = history.completionStatus) !== null && _b !== void 0 ? _b : "unknown" }));
            }
        }
        // 4. Categorize and enrich challenge data
        const weeklyChallenges = [];
        const monthlyChallenges = [];
        const megaChallenges = [];
        const specialEventChallenges = [];
        for (const challenge of challenges) {
            const registeredUsers = ((_c = usersByChallenge[challenge.id]) === null || _c === void 0 ? void 0 : _c.length) || 0;
            const availableSeats = challenge.total_seats != null
                ? Math.max(challenge.total_seats - registeredUsers, 0)
                : null;
            const challengeData = {
                id: challenge.id,
                challenge_type: challenge.challenge_type,
                fee: challenge.fee,
                deadline: challenge.deadline,
                active_status: challenge.active_status,
                registered_users: registeredUsers,
                result_finalization: challenge.result_finalization,
                start_datetime: challenge.start_datetime,
                end_datetime: challenge.end_datetime,
                total_marks: challenge.total_marks,
                total_seats: challenge.total_seats,
                available_seats: availableSeats,
                createdAt: challenge.createdAt,
                updatedAt: challenge.updatedAt,
                users: usersByChallenge[challenge.id] || [],
            };
            switch (challenge.challenge_type) {
                case "weekly":
                    weeklyChallenges.push(challengeData);
                    break;
                case "monthly":
                    monthlyChallenges.push(challengeData);
                    break;
                case "mega":
                    megaChallenges.push(challengeData);
                    break;
                case "special_event":
                    specialEventChallenges.push(challengeData);
                    break;
                default:
                    break;
            }
        }
        // 5. Return all categorized and enriched challenge data
        return res.json({
            weekly: weeklyChallenges,
            monthly: monthlyChallenges,
            mega: megaChallenges,
            special_events: specialEventChallenges,
        });
    }
    catch (error) {
        console.error("Error fetching challenges:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while fetching the data.",
        });
    }
});
exports.getAllChallenges = getAllChallenges;
//get questions of a challenge
const getChallengeQuestions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const challengeId = parseInt(req.params.challengeId);
    if (isNaN(challengeId)) {
        return res.status(400).json({
            success: false,
            message: "Invalid challenge ID.",
        });
    }
    const challengeRepository = data_source_1.AppDataSource.getRepository(Challenge_1.Challenge);
    const questionBankRepository = data_source_1.AppDataSource.getRepository(QuestionBank_1.QuestionBank);
    try {
        const challenge = yield challengeRepository.findOne({
            where: { id: challengeId },
        });
        if (!challenge) {
            return res.status(404).json({
                success: false,
                message: "Challenge not found.",
            });
        }
        const questionIds = challenge.question_ids;
        if (!questionIds || questionIds.length === 0) {
            return res.status(200).json({
                success: true,
                message: "No questions assigned to this challenge.",
                data: [],
            });
        }
        const questions = yield questionBankRepository.findByIds(questionIds);
        return res.status(200).json({
            success: true,
            message: "Questions fetched successfully.",
            data: questions,
        });
    }
    catch (error) {
        console.error("Error fetching challenge questions:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getChallengeQuestions = getChallengeQuestions;
