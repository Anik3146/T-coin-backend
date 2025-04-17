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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSocialMedia = exports.updateSocialMedia = exports.getSocialMediaById = exports.getAllSocialMedia = exports.createSocialMedia = void 0;
const data_source_1 = require("../data-source");
const SocialMedia_1 = require("../entities/SocialMedia");
const constant_1 = __importDefault(require("../utils/constant"));
// Create a new social media entry
const createSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const socialMediaRepo = data_source_1.AppDataSource.getRepository(SocialMedia_1.SocialMedia);
    try {
        const { title, Link } = req.body;
        const icon = req.file; // Assuming 'icon' is uploaded as form-data
        if (!icon) {
            return res.status(400).json({
                success: false,
                message: "Icon is required for the social media entry.",
                data: null,
            });
        }
        // Generate the icon URL/path (could be used to access it later)
        const iconPath = `${constant_1.default}/uploads/${icon.filename}`;
        // Create the social media entry and save it to the DB
        const newSocialMedia = new SocialMedia_1.SocialMedia();
        newSocialMedia.title = title;
        newSocialMedia.Link = Link;
        newSocialMedia.icon = iconPath; // Save the icon URL/path
        yield socialMediaRepo.save(newSocialMedia);
        return res.status(201).json({
            success: true,
            message: "Social Media entry created successfully",
            data: newSocialMedia,
        });
    }
    catch (error) {
        console.error("Error in creating Social Media entry:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.createSocialMedia = createSocialMedia;
// Get all social media entries
const getAllSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const socialMediaRepo = data_source_1.AppDataSource.getRepository(SocialMedia_1.SocialMedia);
    try {
        const socialMediaEntries = yield socialMediaRepo.find();
        return res.status(200).json({
            success: true,
            message: "Social Media entries fetched successfully",
            data: socialMediaEntries,
        });
    }
    catch (error) {
        console.error("Error in fetching Social Media entries:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getAllSocialMedia = getAllSocialMedia;
// Get a social media entry by ID
const getSocialMediaById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const socialMediaRepo = data_source_1.AppDataSource.getRepository(SocialMedia_1.SocialMedia);
    const mediaId = parseInt(req.params.id, 10);
    try {
        if (isNaN(mediaId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Social Media ID format",
                data: null,
            });
        }
        const socialMediaEntry = yield socialMediaRepo.findOne({
            where: { id: mediaId },
        });
        if (!socialMediaEntry) {
            return res.status(404).json({
                success: false,
                message: "Social Media entry not found",
                data: null,
            });
        }
        return res.status(200).json({
            success: true,
            message: "Social Media entry fetched successfully",
            data: socialMediaEntry,
        });
    }
    catch (error) {
        console.error("Error in fetching Social Media entry:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.getSocialMediaById = getSocialMediaById;
// Update a social media entry by ID
const updateSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const socialMediaRepo = data_source_1.AppDataSource.getRepository(SocialMedia_1.SocialMedia);
    const mediaId = parseInt(req.params.id, 10);
    try {
        if (isNaN(mediaId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Social Media ID format",
                data: null,
            });
        }
        const { title, Link } = req.body;
        const socialMediaEntry = yield socialMediaRepo.findOne({
            where: { id: mediaId },
        });
        if (!socialMediaEntry) {
            return res.status(404).json({
                success: false,
                message: "Social Media entry not found",
                data: null,
            });
        }
        socialMediaEntry.title = title || socialMediaEntry.title;
        socialMediaEntry.Link = Link || socialMediaEntry.Link;
        yield socialMediaRepo.save(socialMediaEntry);
        return res.status(200).json({
            success: true,
            message: "Social Media entry updated successfully",
            data: socialMediaEntry,
        });
    }
    catch (error) {
        console.error("Error in updating Social Media entry:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateSocialMedia = updateSocialMedia;
// Delete a social media entry by ID
const deleteSocialMedia = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const socialMediaRepo = data_source_1.AppDataSource.getRepository(SocialMedia_1.SocialMedia);
    const mediaId = parseInt(req.params.id, 10);
    try {
        if (isNaN(mediaId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid Social Media ID format",
                data: null,
            });
        }
        const socialMediaEntry = yield socialMediaRepo.findOne({
            where: { id: mediaId },
        });
        if (!socialMediaEntry) {
            return res.status(404).json({
                success: false,
                message: "Social Media entry not found",
                data: null,
            });
        }
        yield socialMediaRepo.remove(socialMediaEntry);
        return res.status(200).json({
            success: true,
            message: "Social Media entry deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting Social Media entry:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteSocialMedia = deleteSocialMedia;
