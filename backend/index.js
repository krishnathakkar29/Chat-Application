import { v2 as cloudinary } from "cloudinary";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import { errorMiddleware } from "./middleware/error.middleware.js";
import userRouter from "./routes/user.routes.js";
import chatRouter from "./routes/chat.routes.js";
import { connectDB } from "./utils/db.js";
import { createUser } from "./seeders/user.js";

const app = express();

const port = process.env.PORT || 8000;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});
