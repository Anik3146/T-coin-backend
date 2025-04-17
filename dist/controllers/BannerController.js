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
exports.deleteBanner = exports.updateBanner = exports.createBanner = void 0;
const data_source_1 = require("../data-source");
const Banners_1 = require("../entities/Banners");
const constant_1 = __importDefault(require("../utils/constant"));
// Create a new banner
const createBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bannerRepo = data_source_1.AppDataSource.getRepository(Banners_1.Banners);
    try {
        const { title, description, link, active } = req.body;
        const image = req.file; // Assuming 'image' is uploaded as form-data
        if (!image) {
            return res.status(400).json({
                success: false,
                message: "Image is required for the banner.",
                data: null,
            });
        }
        // Generate the image URL/path (could be used to access it later)
        const imagePath = `${constant_1.default}/uploads/${image.filename}`;
        // Create the banner and save it to the DB
        const newBanner = new Banners_1.Banners();
        newBanner.title = title;
        newBanner.description = description;
        newBanner.link = link;
        newBanner.active = active;
        newBanner.image = imagePath; // Save the image URL/path
        newBanner.createdAt = new Date();
        newBanner.updatedAt = new Date();
        yield bannerRepo.save(newBanner);
        return res.status(201).json({
            success: true,
            message: "Banner created successfully",
            data: newBanner,
        });
    }
    catch (error) {
        console.error("Error in creating banner:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.createBanner = createBanner;
// Update an existing banner
const updateBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bannerRepo = data_source_1.AppDataSource.getRepository(Banners_1.Banners);
    const bannerId = req.params.id; // Assuming the ID is passed in the URL
    try {
        const { title, description, link, active } = req.body;
        const image = req.file; // Assuming 'image' is uploaded as form-data
        // Check if the banner exists
        const existingBanner = yield bannerRepo.findOne({
            where: { id: parseInt(bannerId) },
        });
        if (!existingBanner) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
                data: null,
            });
        }
        // Update fields if provided
        if (title)
            existingBanner.title = title;
        if (description)
            existingBanner.description = description;
        if (link)
            existingBanner.link = link;
        if (active !== undefined)
            existingBanner.active = active;
        // If new image is provided, update it
        if (image) {
            const imagePath = `${constant_1.default}/uploads/${image.filename}`;
            existingBanner.image = imagePath;
        }
        // Update the timestamp
        existingBanner.updatedAt = new Date();
        // Save updated banner to the DB
        yield bannerRepo.save(existingBanner);
        return res.status(200).json({
            success: true,
            message: "Banner updated successfully",
            data: existingBanner,
        });
    }
    catch (error) {
        console.error("Error in updating banner:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.updateBanner = updateBanner;
// Delete a banner
const deleteBanner = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bannerRepo = data_source_1.AppDataSource.getRepository(Banners_1.Banners);
    const bannerId = req.params.id; // Assuming the ID is passed in the URL
    try {
        // Find the banner by ID
        const bannerToDelete = yield bannerRepo.findOne({
            where: { id: parseInt(bannerId) },
        });
        if (!bannerToDelete) {
            return res.status(404).json({
                success: false,
                message: "Banner not found.",
                data: null,
            });
        }
        // Delete the banner
        yield bannerRepo.remove(bannerToDelete);
        return res.status(200).json({
            success: true,
            message: "Banner deleted successfully",
            data: null,
        });
    }
    catch (error) {
        console.error("Error in deleting banner:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            data: null,
        });
    }
});
exports.deleteBanner = deleteBanner;
