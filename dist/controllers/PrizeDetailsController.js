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
exports.deletePrizeDetails = exports.updatePrizeDetails = exports.getPrizeDetailsById = exports.addPrizeDetails = exports.getPrizeDetails = void 0;
const data_source_1 = require("../data-source");
const PrizeDetails_1 = require("../entities/PrizeDetails");
// Get all prize details
const getPrizeDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeDetailsRepo = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    try {
        const prizeDetails = yield prizeDetailsRepo.find();
        if (!prizeDetails || prizeDetails.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Prize details not found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Prize details fetched successfully.",
            data: prizeDetails,
        });
    }
    catch (error) {
        console.error("Error in fetching prize details:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getPrizeDetails = getPrizeDetails;
// Add prize details (no challenge association anymore)
const addPrizeDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeDetailsRepo = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    try {
        const { prize_positions, global_board } = req.body;
        // Create prize details with the provided prize positions
        const prizeDetail = prizeDetailsRepo.create({
            prize_positions, // Prize positions from the request body
            global_board,
        });
        // Save the prize detail record
        yield prizeDetailsRepo.save(prizeDetail);
        return res.status(201).json({
            success: true,
            message: "Prize details added successfully.",
            data: prizeDetail,
        });
    }
    catch (error) {
        console.error("Error in adding prize details:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.addPrizeDetails = addPrizeDetails;
// Get prize details by ID
const getPrizeDetailsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeDetailsRepo = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    try {
        const prizeDetailsId = req.params.id;
        const prizeDetail = yield prizeDetailsRepo.findOne({
            where: { id: parseInt(prizeDetailsId) },
        });
        if (!prizeDetail) {
            return res.status(404).json({
                success: false,
                message: "Prize details not found.",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Prize details fetched successfully.",
            data: prizeDetail,
        });
    }
    catch (error) {
        console.error("Error in fetching prize details by ID:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getPrizeDetailsById = getPrizeDetailsById;
// Update prize details by ID (no challenge association)
const updatePrizeDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeDetailsRepo = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    try {
        const prizeDetailsId = req.params.id;
        const { prize_positions, global_board } = req.body;
        // Validate prize_positions structure
        if (!prize_positions || !Array.isArray(prize_positions)) {
            return res.status(400).json({
                success: false,
                message: "Invalid prize positions data. It must be an array.",
                data: null,
            });
        }
        // Find the prize details to update
        const prizeDetail = yield prizeDetailsRepo.findOne({
            where: { id: parseInt(prizeDetailsId) },
        });
        if (!prizeDetail) {
            return res.status(404).json({
                success: false,
                message: "Prize details not found.",
                data: null,
            });
        }
        // Update the prize positions (no challenge association anymore)
        prizeDetail.prize_positions = prize_positions;
        // Update global_board if provided in the request body
        if (typeof global_board === "boolean") {
            prizeDetail.global_board = global_board;
        }
        // Save the updated prize details
        yield prizeDetailsRepo.save(prizeDetail);
        return res.status(200).json({
            success: true,
            message: "Prize details updated successfully.",
            data: prizeDetail,
        });
    }
    catch (error) {
        console.error("Error in updating prize details:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updatePrizeDetails = updatePrizeDetails;
// Delete prize details by ID
const deletePrizeDetails = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const prizeDetailsRepo = data_source_1.AppDataSource.getRepository(PrizeDetails_1.PrizeDetails);
    try {
        const prizeDetailsId = req.params.id;
        const prizeDetail = yield prizeDetailsRepo.findOne({
            where: { id: parseInt(prizeDetailsId) },
        });
        if (!prizeDetail) {
            return res.status(404).json({
                success: false,
                message: "Prize details not found.",
                data: null,
            });
        }
        yield prizeDetailsRepo.remove(prizeDetail);
        return res.status(200).json({
            success: true,
            message: "Prize details deleted successfully.",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting prize details:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deletePrizeDetails = deletePrizeDetails;
