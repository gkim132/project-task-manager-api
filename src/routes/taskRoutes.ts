import express from "express";
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} from "../controllers/taskController";
import { taskValidation } from "../middleware/validationMiddleware";
import { objectIdMiddleware } from "../middleware/objectIdMiddleware";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Time:", new Date());
  next();
});

router.route("/").post(taskValidation, createTask).get(getAllTasks);
router
  .route("/:id")
  .all(objectIdMiddleware)
  .get(getTask)
  .patch(taskValidation, updateTask)
  .delete(deleteTask);

export default router;
