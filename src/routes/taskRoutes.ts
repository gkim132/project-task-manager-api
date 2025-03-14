import express from "express";
import * as taskController from "../controllers/taskController";
import validateMiddleware from "../middleware/validateMiddleware";
import { taskValidation } from "../middleware/validations/taskValidation";
import { objectIdMiddleware } from "../middleware/objectIdMiddleware";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Time:", new Date());
  next();
});

router
  .route("/")
  .post(validateMiddleware(taskValidation), taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route("/:id")
  .all(objectIdMiddleware)
  .get(taskController.getTask)
  .patch(validateMiddleware(taskValidation), taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
