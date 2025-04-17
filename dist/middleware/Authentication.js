"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";
// Middleware to authenticate and verify JWT token
const authenticateToken = (req, res, next // Use NextFunction for type safety
) => {
    var _a;
    // The return type should be void
    const token = (_a = req.headers["authorization"]) === null || _a === void 0 ? void 0 : _a.split(" ")[1]; // Extract token from "Bearer token"
    if (!token) {
        // Send response if no token is provided
        res.status(403).json({ message: "Token is required" });
        return; // Ensure function execution stops after sending the response
    }
    // Verify the token
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            // Send response if token is invalid or expired
            res.status(403).json({ message: "Invalid or expired token" });
            return; // Ensure function execution stops after sending the response
        }
        // Attach user data to the request object if token is valid
        req.user = user;
        // Call next to pass control to the next middleware or route handler
        next();
    });
};
exports.authenticateToken = authenticateToken;
