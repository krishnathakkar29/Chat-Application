import { v2 as cloudinary } from "cloudinary";
import { v4 as uuid } from "uuid";
import jwt from "jsonwebtoken";
import multer from "multer";
import { userSocketIDs } from "../index.js";
export const cookieOptions = {
  httpOnly: true,
  secure: true,
  maxAge: 24 * 60 * 60 * 1000,
};

export const getBase64 = (file) =>
  `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

export class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const AsyncHandler = (passedFn) => async (req, res, next) => {
  try {
    await passedFn(req, res, next);
  } catch (error) {
    next(error);
  }
};

export const uploadFilesToCloudinary = async (files = []) => {
  const uploadPromises = files.map((file) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        getBase64(file),
        {
          resource_type: "auto",
          public_id: uuid(),
        },
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  });

  try {
    const results = await Promise.all(uploadPromises);

    const formattedResults = results.map((result) => ({
      public_id: result.public_id,
      url: result.secure_url,
    }));
    return formattedResults;
  } catch (err) {
    throw new Error("Error uploading files to cloudinary", err);
  }
};

export const sendToken = async (res, user, code, message) => {
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  return res.status(code).cookie("chat-token", token, cookieOptions).json({
    success: true,
    user,
    message,
  });
};

export const multerUpload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export const getSockets = (users = []) => {
  let sockets = [];

  users.forEach((user) => {
    const userId = user.toString();
    const socketId = userSocketIDs.get(userId);

    sockets.push(socketId);
  });

  return sockets;
};

export const emitEvent = (req, event, users, data) => {
  const io = req.app.get("io");
  const usersSocket = getSockets(users);
  io.to(usersSocket).emit(event, data);
};
