import express from "express";
import { getUserProfile } from "../controller/userController.js";
import userAuth from "../middleware/userAuth.js";

const userRouter = express.Router();
userRouter.get("/userdata", userAuth, getUserProfile);

export default userRouter;