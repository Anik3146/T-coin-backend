import dotenv from "dotenv";
dotenv.config();

const baseUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BASE_URL
    : "http://localhost:5001";

export default baseUrl;
