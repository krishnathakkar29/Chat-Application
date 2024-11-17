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
import { createMessagesInAChat } from "./seeders/chat.js";
import { Server } from "socket.io";
import http from "http";
import { socketAuthenticator } from "./middleware/auth.middleware.js";
import { Message } from "./models/message.model.js";
import { v4 as uuid } from "uuid";
import { getSockets } from "./utils/utils.js";
import {
  NEW_MESSAGE,
  NEW_MESSAGE_ALERT,
  START_TYPING,
  STOP_TYPING,
} from "./constants/events.js";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
    origin: ["http://localhost:5173", process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

const port = process.env.PORT || 8000;
const userSocketIDs = new Map();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

connectDB();

app.set("io", io);

app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: ["*", process.env.CLIENT_URL],
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/health", (req, res, next) => {
  try {
    return res.status(200).json({
      status: true,
      health: "ok",
    });
  } catch (error) {
    console.log("Error in health route: ", error);
    return res.json({
      success: false,
      message: "failed",
    });
  }
});

app.use("/api/v1/user", userRouter);
app.use("/api/v1/chat", chatRouter);

io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.response, async (err) => {
    await socketAuthenticator(err, socket, next);
  });
});

io.on("connection", (socket) => {
  const user = socket.user;

  // console.log(`Joined ${socket.id}`);

  userSocketIDs.set(user._id.toString(), socket.id);

  socket.on(NEW_MESSAGE, async ({ chatId, members, message }) => {
    console.log(message);
    const messageForRealTime = {
      content: message,
      _id: uuid(),
      sender: {
        _id: user._id,
        name: user.name,
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    const messageForDB = {
      content: message,
      sender: user._id,
      chat: chatId,
    };
    const membersSockets = getSockets(members);

    try {
      await Message.create(messageForDB);
    } catch (error) {}

    io.to(membersSockets).emit(NEW_MESSAGE, {
      chatId,
      message: messageForRealTime,
    });

    // console.log("emitting for real time", messageForRealTime);
    io.to(membersSockets).emit(NEW_MESSAGE_ALERT, { chatId });
  });

  socket.on(START_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(START_TYPING, { chatId });
  });
  socket.on(STOP_TYPING, ({ members, chatId }) => {
    const membersSockets = getSockets(members);
    socket.to(membersSockets).emit(STOP_TYPING, { chatId });
  });

  socket.on("disconnect", () => {
    userSocketIDs.delete(user._id.toString());
  });
});

app.use(errorMiddleware);

server.listen(port, () => {
  console.log(`server is listening on port ${port}`);
});

export { userSocketIDs };
