import express from "express";
import { isAuthenticated } from "../middleware/auth.middleware.js";


const app = express.Router();

app.use(isAuthenticated);



export default app;
