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
import { authenticateUser, authroizeRole } from "../middleware/authMiddleware";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Time:", new Date());
  console.log(req.headers);
  next();
});

router
  .route("/")
  .post(authenticateUser, taskValidation, createTask)
  .get(authenticateUser, getAllTasks)
  .delete(authenticateUser, authroizeRole("admin"), deleteAllTasks);
router
  .route("/:id")
  .all(objectIdMiddleware)
  .get(getTask)
  .patch(authenticateUser, taskValidation, updateTask)
  .delete(authenticateUser, deleteTask);

export default router;
