import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { getMyChats } from "../controllers/chat.controller.js";

const app = express.Router();

app.use(isAuthenticated);

app.get("/my", getMyChats);

export default app;
