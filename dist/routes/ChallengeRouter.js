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
const ChallengeController_1 = require("../controllers/ChallengeController"); // Ensure the functions are imported correctly
const Authentication_1 = require("../middleware/Authentication");
const router = (0, express_1.Router)();
// Route to create a new challenge
router.post("/create", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.createChallenge)(req, res); // Create a new challenge
    }
    catch (error) {
        console.error("Error in creating challenge:", error);
        res.status(500).json({
            message: "An unexpected error occurred while creating the challenge.",
        });
    }
}));
// Route to update an existing challenge
router.put("/update", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.updateChallenge)(req, res); // Update an existing challenge
    }
    catch (error) {
        console.error("Error in updating challenge:", error);
        res.status(500).json({
            message: "An unexpected error occurred while updating the challenge.",
        });
    }
}));
// Route to delete a challenge by its ID
router.delete("/delete/:challengeId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.deleteChallenge)(req, res); // Delete a challenge by ID
    }
    catch (error) {
        console.error("Error in deleting challenge:", error);
        res.status(500).json({
            message: "An unexpected error occurred while deleting the challenge.",
        });
    }
}));
// Route to register for a challenge
router.post("/register", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.registerUserForChallenge)(req, res); // Register user for a challenge
    }
    catch (error) {
        console.error("Error in registering for challenge:", error);
        res
            .status(500)
            .json({ message: "An unexpected error occurred during registration." });
    }
}));
// // Route to calculate positions and prizes based on scores and challenge history
// router.post("/calculate-prizes", async (req, res) => {
//   try {
//     await calculatePositionAndPrizes(req, res); // Calculate positions and prize money based on scores
//   } catch (error) {
//     console.error("Error in calculating positions and prizes:", error);
//     res.status(500).json({
//       message:
//         "An unexpected error occurred while calculating positions and prizes.",
//     });
//   }
// });
// Route to get user results by challenge type, date, or score (week, month, year)
router.get("/results/:userId/:challengeId/:period", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.getResults)(req, res); // Fetch user results based on period (week/month/year)
    }
    catch (error) {
        console.error("Error in fetching results:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching results.",
        });
    }
}));
// **Route to fetch practice questions with or without subjectId**
router.post("/practice-questions/:subjectId?", // Route for fetching practice questions (with or without subjectId)
Authentication_1.authenticateToken, // Ensure the user is authenticated
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { userId } = req.body;
        const authenticatedUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
        // Check if userId in body matches the authenticated user ID
        if (Number(userId) !== authenticatedUserId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized access.",
            });
        }
        // Call the function to get practice questions for the user
        yield (0, ChallengeController_1.getPracticeQuestions)(req, res);
    }
    catch (error) {
        console.error("Error fetching practice questions for user:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while fetching practice questions.",
        });
    }
}));
// **Route to submit score for a specific answered question**
router.post("/submit-score", // Route for submitting score
Authentication_1.authenticateToken, // Ensure the user is authenticated
(req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, questionId, score } = req.body; // Extract the necessary data from the request body
        // Ensure the userId from the body matches the userId from the token
        if (Number(userId) !== req.user.id) {
            return res.status(403).json({ message: "Unauthorized access." });
        }
        // Call the function to submit score
        yield (0, ChallengeController_1.submitScore)(req, res);
    }
    catch (error) {
        console.error("Error submitting score:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while submitting the score.",
        });
    }
}));
// **New Route** to fetch users registered for a specific challenge
router.get("/:challengeId/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.getUsersInChallenge)(req, res); // Fetch users registered in the specific challenge
    }
    catch (error) {
        console.error("Error in fetching users for challenge:", error);
        res.status(500).json({
            message: "An unexpected error occurred while fetching users for the challenge.",
        });
    }
}));
// **New Route** to fetch challenge results for a specific challenge
router.get("/:challengeId/results", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch challenge results for the given challengeId
        yield (0, ChallengeController_1.getChallengeResults)(req, res); // Fetch results using the function created earlier
    }
    catch (error) {
        console.error("Error fetching challenge results:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while fetching challenge results.",
        });
    }
}));
// **New Route** distribute prize money
router.post("/:challengeId/distribute-prize-money", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { challengeId } = req.params; // Extract challengeId from the route parameters
        // Validate if challengeId exists
        if (!challengeId) {
            return res.status(400).json({ message: "Challenge ID is required." });
        }
        // Fetch the challenge results (in this case, updating user prize money)
        yield (0, ChallengeController_1.setUserAmountBasedOnPrizeMoney)(req, res); // Using the function that processes the results
    }
    catch (error) {
        console.error("Error fetching challenge results:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while fetching challenge results.",
        });
    }
}));
// Route to get all challenges and their details
router.get("/all-challenges", (req, res) => {
    try {
        (0, ChallengeController_1.getAllChallenges)(req, res); // Call the controller function directly
    }
    catch (error) {
        console.error("Error in route handler:", error);
        res.status(500).json({
            error: "Something went wrong while processing your request.",
        });
    }
});
// **New Route** to fetch questions of a specific challenge
router.get("/:challengeId/questions", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, ChallengeController_1.getChallengeQuestions)(req, res); // Calls the controller function
    }
    catch (error) {
        console.error("Error fetching challenge questions:", error);
        return res.status(500).json({
            message: "An unexpected error occurred while fetching challenge questions.",
        });
    }
}));
exports.default = router;
