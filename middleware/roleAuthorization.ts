import { Request, Response, NextFunction } from "express";

// Role-based access control middleware
export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized: No user information" });
      return;
    }

    const userRole = req.user.role;

    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        message: `Access denied: Role '${userRole}' is not allowed`,
      });
      return;
    }

    next();
  };
};
