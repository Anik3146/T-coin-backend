"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
// Set up multer storage engine
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Save files in the 'uploads' directory
    },
    filename: (req, file, cb) => {
        const ext = path_1.default.extname(file.originalname); // Get file extension
        cb(null, Date.now() + ext); // Rename the file to be unique
    },
});
// Initialize multer with the storage engine
const upload = (0, multer_1.default)({ storage: storage });
exports.upload = upload;
