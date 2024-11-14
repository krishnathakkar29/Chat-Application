import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  deleteChat,
  getChatDetails,
  getMessages,
  getMyChats,
  newGroupChat,
} from "../controllers/chat.controller.js";

const app = express.Router();

app.use(isAuthenticated);

app.get("/my", getMyChats);
app.get("/message/:id", getMessages);
app.route("/:id").get(getChatDetails).delete(deleteChat);
app.post("/new", newGroupChat);

export default app;
