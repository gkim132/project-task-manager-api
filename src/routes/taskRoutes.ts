import express from "express";
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask,
  deleteAllTasks
} from "../controllers/taskController";
import { taskValidation } from "../middleware/validationMiddleware";
import { objectIdMiddleware } from "../middleware/objectIdMiddleware";
import { authenticateUser, authorizeRole } from "../middleware/authMiddleware";

const router = express.Router();

router
  .route("/")
  .post(authenticateUser, taskValidation, createTask)
  .delete(authenticateUser, authorizeRole("admin"), deleteAllTasks);

router.route("/allTasks").get(authenticateUser, getAllTasks);

router
  .route("/:id")
  .all(objectIdMiddleware)
  .get(getTask)
  .patch(authenticateUser, taskValidation, updateTask)
  .delete(authenticateUser, deleteTask);

export default router;
