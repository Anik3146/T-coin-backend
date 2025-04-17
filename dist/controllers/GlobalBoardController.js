"use strict";
// import { Request, Response } from "express";
// import { AppDataSource } from "../data-source"; // Import the data source
// import { GlobalBoardRank } from "../entities/GlobalBoardRank";
// import { Challenge } from "../entities/Challenge";
// import { ChallengeHistory } from "../entities/ChallengeHistory";
// import { User } from "../entities/User";
// import { Between } from "typeorm"; // For filtering by date range
// // Controller to get Global Board (weekly, monthly, and mega challenges eligibility)
// export const getGlobalBoard = async (
//   req: Request,
//   res: Response
// ): Promise<Response> => {
//   const globalBoardRepo = AppDataSource.getRepository(GlobalBoardRank);
//   const challengeRepo = AppDataSource.getRepository(Challenge);
//   const challengeHistoryRepo = AppDataSource.getRepository(ChallengeHistory);
//   const userRepo = AppDataSource.getRepository(User);
//   try {
//     // Get the current month and year
//     const currentDate = new Date();
//     const currentMonth = currentDate.getMonth() + 1; // 0-based, so we add 1
//     const currentYear = currentDate.getFullYear();
//     // Get the start and end of the current month
//     const startOfMonth = new Date(currentYear, currentMonth - 1, 1);
//     const endOfMonth = new Date(currentYear, currentMonth, 0); // Last day of the month
//     // Get all users
//     const users = await userRepo.find();
//     // Prepare an object to store counts and scores for each user
//     const userChallengeCounts: Record<
//       number,
//       { weekly: number; monthly: number; mega: number; total: number }
//     > = {};
//     // For each user, count their weekly, monthly, and mega challenges in the current month
//     for (const user of users) {
//       const weeklyChallenges = await challengeHistoryRepo.count({
//         where: {
//           user: { id: user.id }, // Filter by user
//           challenge: { challenge_type: "weekly" },
//           challenge_date: Between(startOfMonth, endOfMonth), // Filter by date range for current month
//         },
//       });
//       const monthlyChallenges = await challengeHistoryRepo.count({
//         where: {
//           user: { id: user.id },
//           challenge: { challenge_type: "monthly" },
//           challenge_date: Between(startOfMonth, endOfMonth),
//         },
//       });
//       const megaChallenges = await challengeHistoryRepo.count({
//         where: {
//           user: { id: user.id },
//           challenge: { challenge_type: "mega" },
//           challenge_date: Between(startOfMonth, endOfMonth),
//         },
//       });
//       // Store the counts and calculate total
//       const totalChallenges =
//         weeklyChallenges + monthlyChallenges + megaChallenges;
//       userChallengeCounts[user.id] = {
//         weekly: weeklyChallenges,
//         monthly: monthlyChallenges,
//         mega: megaChallenges,
//         total: totalChallenges, // Calculate the total of weekly + monthly + mega
//       };
//     }
//     // Get challenge count for global eligibility tracking (this is overall for each type)
//     const weeklyChallengeCount = await challengeRepo.count({
//       where: { challenge_type: "weekly" },
//     });
//     const monthlyChallengeCount = await challengeRepo.count({
//       where: { challenge_type: "monthly" },
//     });
//     const megaChallengeCount = await challengeRepo.count({
//       where: { challenge_type: "mega" },
//     });
//     // Fetch global board data (you can also sort it if needed, here assuming it's already sorted)
//     const globalBoard = await globalBoardRepo.find();
//     // Sort users based on the total challenges completed (weekly, monthly, and mega)
//     const sortedUsers = Object.entries(userChallengeCounts)
//       .sort(([, a], [, b]) => b.total - a.total) // Sort by total challenges descending
//       .map(([userId, counts]) => ({
//         userId,
//         ...counts, // Include challenge counts
//       }));
//     // Respond with the success message and data
//     return res.status(200).json({
//       success: true,
//       message: "Global board data fetched successfully",
//       data: {
//         globalBoard,
//         weeklyChallengeCount,
//         monthlyChallengeCount,
//         megaChallengeCount,
//         leaderboard: sortedUsers, // Include sorted leaderboard by total challenges
//       },
//     });
//   } catch (error: any) {
//     // In case of an error, respond with failure message
//     return res.status(500).json({
//       success: false,
//       message: "An unexpected error occurred",
//       data: null,
//     });
//   }
// };
