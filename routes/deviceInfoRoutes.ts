// import { Router } from "express";
// import {
//   getDeviceInfo,
//   addOrUpdateDeviceInfo,
//   getDeviceInfoById,
//   deleteDeviceInfo,
// } from "../controllers/DeviceInfoController";

// const router = Router();

// // Route to get all device information
// router.get("/", async (req, res) => {
//   try {
//     await getDeviceInfo(req, res);
//   } catch (error) {
//     console.error("Error in fetching device information:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });

// // Route to add or update device information
// router.post("/add-or-update", async (req, res) => {
//   try {
//     await addOrUpdateDeviceInfo(req, res);
//   } catch (error) {
//     console.error("Error in adding/updating device information:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });

// // Route to get device information by ID
// router.get("/:id", async (req, res) => {
//   try {
//     await getDeviceInfoById(req, res);
//   } catch (error) {
//     console.error("Error in fetching device information by ID:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });

// // Route to delete device information by ID
// router.delete("/:id", async (req, res) => {
//   try {
//     await deleteDeviceInfo(req, res);
//   } catch (error) {
//     console.error("Error in deleting device information:", error);
//     res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred.",
//       data: null,
//     });
//   }
// });

// export default router;
