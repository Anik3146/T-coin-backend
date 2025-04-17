"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/app.ts
const express_1 = __importDefault(require("express"));
const data_source_1 = require("./data-source"); // Assuming your data source is configured here
const UserRoutes_1 = __importDefault(require("./routes/UserRoutes"));
const NotificationRouter_1 = __importDefault(require("./routes/NotificationRouter"));
const ContactUsRouter_1 = __importDefault(require("./routes/ContactUsRouter"));
const SocialMediaRoutes_1 = __importDefault(require("./routes/SocialMediaRoutes"));
const BannerRoutes_1 = __importDefault(require("./routes/BannerRoutes"));
const activityLogRoutes_1 = __importDefault(require("./routes/activityLogRoutes"));
const TransactionHistoryRoutes_1 = __importDefault(require("./routes/TransactionHistoryRoutes"));
const BreakingNewsRoutes_1 = __importDefault(require("./routes/BreakingNewsRoutes"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Initialize the data source
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log("Connected to MySQL");
})
    .catch((error) => {
    console.error("Error connecting to the database:", error);
});
// Use the routes
app.use("/api/users", UserRoutes_1.default);
app.use("/api/notifications", NotificationRouter_1.default);
app.use("/api/contact-us", ContactUsRouter_1.default);
app.use("/api/social-media", SocialMediaRoutes_1.default);
app.use("/api/banners", BannerRoutes_1.default);
app.use("/api/activityLog", activityLogRoutes_1.default);
app.use("/api/transaction-history", TransactionHistoryRoutes_1.default);
app.use("/api/breaking-news", BreakingNewsRoutes_1.default);
// // Serve static files (e.g., images) from the 'uploads' directory
app.use("/uploads", express_1.default.static(path_1.default.join(__dirname, "../uploads")));
// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
