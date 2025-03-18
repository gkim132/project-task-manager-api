import express from "express";
import { userValidation } from "../middleware/validationMiddleware";
import { getAllUsers, signup, login } from "../controllers/authController";

const userRouter = express.Router();

userRouter.route("/").post(userValidation, signup).get(getAllUsers);

userRouter.route("/login").post(login);

export default userRouter;
