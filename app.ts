// src/app.ts
import express from "express";
import { AppDataSource } from "./data-source"; // Assuming your data source is configured here
import userRoutes from "./routes/UserRoutes";
import notificationRoutes from "./routes/NotificationRouter";
import contactUsRouters from "./routes/ContactUsRouter";
import socialMediaRoutes from "./routes/SocialMediaRoutes";
import bannerRoutes from "./routes/BannerRoutes";
import activityLogRoutes from "./routes/activityLogRoutes";
import transactionHistoryRoutes from "./routes/TransactionHistoryRoutes";
import breakingNewsRoutes from "./routes/BreakingNewsRoutes";

import cors from "cors";
import path from "path";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize the data source
AppDataSource.initialize()
  .then(() => {
    console.log("Connected to MySQL");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Use the routes
app.use("/api/users", userRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/contact-us", contactUsRouters);
app.use("/api/social-media", socialMediaRoutes);
app.use("/api/banners", bannerRoutes);
app.use("/api/activityLog", activityLogRoutes);
app.use("/api/transaction-history", transactionHistoryRoutes);
app.use("/api/breaking-news", breakingNewsRoutes);

// // Serve static files (e.g., images) from the 'uploads' directory
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Start the server
const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
