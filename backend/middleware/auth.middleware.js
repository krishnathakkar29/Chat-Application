import { AsyncHandler, ErrorHandler } from "../utils/utils.js";
import jwt from "jsonwebtoken";

export const isAuthenticated = AsyncHandler(async (req, res, next) => {
  const token = req.cookies["chat-token"];

  if (!token)
    return next(new ErrorHandler("Please login to access this route", 401));

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);

  req.user = decodedData._id;

  next();
});
