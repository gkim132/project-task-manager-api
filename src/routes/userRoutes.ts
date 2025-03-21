import express from "express";
import { userValidation } from "../middleware/validationMiddleware";
import {
  getAllUsers,
  signup,
  login,
  updatePassword,
  myProfile
} from "../controllers/authController";
import { authenticateUser } from "../middleware/authMiddleware";

const userRouter = express.Router();

userRouter.post("/signup", userValidation, signup);
userRouter.get("/allUsers", getAllUsers);
userRouter.post("/login", login);
userRouter.patch("/updatePassword", authenticateUser, updatePassword);
userRouter.get("/me", authenticateUser, myProfile);

export default userRouter;
