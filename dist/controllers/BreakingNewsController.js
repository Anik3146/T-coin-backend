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
exports.deleteBreakingNews = exports.updateBreakingNews = exports.getAllBreakingNews = exports.createBreakingNews = void 0;
const data_source_1 = require("../data-source");
const BreakingNews_1 = require("../entities/BreakingNews");
// Create breaking news
const createBreakingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, active_status } = req.body;
    try {
        const breakingNewsRepo = data_source_1.AppDataSource.getRepository(BreakingNews_1.BreakingNews);
        const breakingNews = new BreakingNews_1.BreakingNews();
        breakingNews.title = title;
        breakingNews.content = content;
        breakingNews.active_status = active_status !== null && active_status !== void 0 ? active_status : true; // default to true if not provided
        yield breakingNewsRepo.save(breakingNews);
        return res.status(201).json({
            success: true,
            message: "Breaking news created successfully",
            data: breakingNews,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.createBreakingNews = createBreakingNews;
// Get all breaking news
const getAllBreakingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const breakingNewsRepo = data_source_1.AppDataSource.getRepository(BreakingNews_1.BreakingNews);
        const newsList = yield breakingNewsRepo.find({
            order: { publishedAt: "DESC" },
        });
        return res.status(200).json({
            success: true,
            message: "Breaking news fetched successfully",
            data: newsList,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.getAllBreakingNews = getAllBreakingNews;
// Update breaking news
const updateBreakingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { title, content, active_status } = req.body;
    try {
        const breakingNewsRepo = data_source_1.AppDataSource.getRepository(BreakingNews_1.BreakingNews);
        const breakingNews = yield breakingNewsRepo.findOneBy({ id: parseInt(id) });
        if (!breakingNews) {
            return res.status(404).json({
                success: false,
                message: "Breaking news not found",
                data: null,
            });
        }
        breakingNews.title = title !== null && title !== void 0 ? title : breakingNews.title;
        breakingNews.content = content !== null && content !== void 0 ? content : breakingNews.content;
        breakingNews.active_status = active_status !== null && active_status !== void 0 ? active_status : breakingNews.active_status;
        yield breakingNewsRepo.save(breakingNews);
        return res.status(200).json({
            success: true,
            message: "Breaking news updated successfully",
            data: breakingNews,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.updateBreakingNews = updateBreakingNews;
// Delete breaking news
const deleteBreakingNews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const breakingNewsRepo = data_source_1.AppDataSource.getRepository(BreakingNews_1.BreakingNews);
        const breakingNews = yield breakingNewsRepo.findOneBy({ id: parseInt(id) });
        if (!breakingNews) {
            return res.status(404).json({
                success: false,
                message: "Breaking news not found",
                data: null,
            });
        }
        yield breakingNewsRepo.remove(breakingNews);
        return res.status(200).json({
            success: true,
            message: "Breaking news deleted successfully",
            data: null,
        });
    }
    catch (error) {
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred",
            data: null,
        });
    }
});
exports.deleteBreakingNews = deleteBreakingNews;
