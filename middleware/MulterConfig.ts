import multer from "multer";
import path from "path";

// Set up multer storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname); // Get file extension
    cb(null, Date.now() + ext); // Rename the file to be unique
  },
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

export { upload };
