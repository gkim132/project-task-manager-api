import express from "express";
import {
  createTask,
  getAllTasks,
  getTask,
  updateTask,
  deleteTask
} from "../controllers/taskController";
import { validateTask } from "../middleware/validationMiddleware";
import { objectIdMiddleware } from "../middleware/objectIdMiddleware";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Time:", new Date());
  next();
});

router.route("/").post(validateTask, createTask).get(getAllTasks);
router
  .route("/:id")
  .all(objectIdMiddleware)
  .get(getTask)
  .patch(validateTask, updateTask)
  .delete(deleteTask);

export default router;
