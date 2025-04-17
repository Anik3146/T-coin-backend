import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

// Secret for JWT
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Middleware to authenticate and verify JWT token
export const authenticateToken = (
  req: Request,
  res: Response,
  next: NextFunction // Use NextFunction for type safety
): void => {
  // The return type should be void
  const token = req.headers["authorization"]?.split(" ")[1]; // Extract token from "Bearer token"

  if (!token) {
    // Send response if no token is provided
    res.status(403).json({ message: "Token is required" });
    return; // Ensure function execution stops after sending the response
  }

  // Verify the token
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
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
