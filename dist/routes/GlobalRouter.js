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
const ChallengeController_1 = require("../controllers/ChallengeController"); // Import the controller function
const router = (0, express_1.Router)();
// Route to get Global Board for any challenge type (monthly, weekly, mega)
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { type } = req.params; // Extract the type of challenge from URL parameters (e.g., "weekly", "monthly", or "mega")
    const { result_finalization } = req.body; // Extract result_finalization from the body
    // // Validate that the type is one of the valid challenge types
    // if (!["monthly", "weekly", "mega"].includes(type)) {
    //   return res.status(400).json({
    //     success: false,
    //     message:
    //       "Invalid challenge type. Please provide 'weekly', 'monthly', or 'mega'.",
    //   });
    // }
    // Validate that result_finalization is a boolean (optional step depending on the use case)
    if (result_finalization === undefined ||
        typeof result_finalization !== "boolean") {
        return res.status(400).json({
            message: "Invalid value for result_finalization. It must be a boolean.",
        });
    }
    try {
        // Pass the request and response to the controller function
        yield (0, ChallengeController_1.getGlobalBoard)(req, res); // Handles the logic in the controller
    }
    catch (error) {
        console.error("Error in fetching global board:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred while fetching the global board.",
            data: null,
        });
    }
}));
exports.default = router;
