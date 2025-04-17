"use strict";
// import { Router } from "express";
// import {
//   getAppInfo,
//   addOrUpdateAppInfo,
//   getLatestAppVersion,
//   getPrivacyPolicy,
//   deleteAppInfo,
// } from "../controllers/AppInfoController";
// const router = Router();
// // Route to get app information
// router.get("/", async (req, res) => {
//   try {
//     await getAppInfo(req, res);
//   } catch (error) {
//     console.error("Error in fetching app information:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });
// // Route to add or update app information
// router.post("/add-or-update", async (req, res) => {
//   try {
//     await addOrUpdateAppInfo(req, res);
//   } catch (error) {
//     console.error("Error in adding/updating app information:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });
// // Route to get the latest app version
// router.get("/latest-version", async (req, res) => {
//   try {
//     await getLatestAppVersion(req, res);
//   } catch (error) {
//     console.error("Error in fetching latest app version:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });
// // Route to get privacy policy
// router.get("/privacy-policy", async (req, res) => {
//   try {
//     await getPrivacyPolicy(req, res);
//   } catch (error) {
//     console.error("Error in fetching privacy policy:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });
// // Route to delete app information
// router.delete("/delete", async (req, res) => {
//   try {
//     await deleteAppInfo(req, res);
//   } catch (error) {
//     console.error("Error in deleting app information:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });
// export default router;
