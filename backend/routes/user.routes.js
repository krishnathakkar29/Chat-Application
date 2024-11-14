import express from "express";
import {
  acceptFriendRequest,
  getMyFriends,
  getMyNotifications,
  getMyProfile,
  login,
  logout,
  newUser,
  searchUser,
  sendFriendRequest,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { multerUpload } from "../utils/utils.js";

const app = express.Router();

app.post("/new", multerUpload.single("avatar"), newUser);
app.post("/login", login);

app.use(isAuthenticated);

app.get("/me", getMyProfile);
app.get("/logout", logout);
app.get("/search", searchUser);
app.put("/sendrequest", sendFriendRequest);
app.put("/acceptrequest", acceptFriendRequest);

app.get("/notifications", getMyNotifications);
app.get("/friends", getMyFriends);
export default app;
