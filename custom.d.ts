// src/types/custom.d.ts or src/custom.d.ts (choose the path based on your project structure)
declare namespace Express {
  export interface Request {
    user?: {
      id: number;
      role: string;
    };
  }
}
