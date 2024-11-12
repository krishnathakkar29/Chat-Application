import express from "express";
import {
  getMyProfile,
  login,
  logout,
  newUser,
} from "../controllers/user.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";
import { multerUpload } from "../utils/utils.js";

const app = express.Router();

app.post("/new", multerUpload.single("avatar"), newUser);
app.post("/login", login);

app.use(isAuthenticated);

app.get("/me", getMyProfile);
app.get("/logout", logout);

export default app;
