// src/types/multer.d.ts

import { Request } from "express";
import { File } from "multer";

declare global {
  namespace Express {
    interface Request {
      file?: File; // Single file upload
      files?: File[]; // Multiple file upload (if needed)
    }
  }
}
