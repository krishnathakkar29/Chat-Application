import { compare } from "bcrypt";
import { User } from "../models/user.model.js";
import {
  AsyncHandler,
  ErrorHandler,
  sendToken,
  uploadFilesToCloudinary,
} from "../utils/utils.js";

const newUser = AsyncHandler(async (req, res, next) => {
  const { name, username, password } = req.body;

  const file = req.file;

  if (!file) return next(new ErrorHandler("Please Upload Avatar"));

  const result = await uploadFilesToCloudinary([file]);

  const avatar = {
    public_id: result[0].public_id,
    url: result[0].url,
  };

  const user = await User.create({
    name,
    username,
    password,
    avatar,
  });


  sendToken(res, user, 201, "User created");
});

const login = AsyncHandler(async (req, res, next) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username }).select("+password");

  if (!user) return next(new ErrorHandler("Invalid Username or Password", 404));

  const isMatch = await compare(password, user.password);

  if (!isMatch)
    return next(new ErrorHandler("Invalid Username or Password", 404));

  sendToken(res, user, 200, `Welcome back ${user.username}`);
});

const logout = AsyncHandler(async (req, res, next) => {
  return res
    .status(200)
    .cookie("chat-token", "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged Out Successfully!",
    });
});

const getMyProfile = AsyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user);

  return res.status(200).json({
    success: true,
    user,
  });
});

export { newUser, login, logout, getMyProfile };
