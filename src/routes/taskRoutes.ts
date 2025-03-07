import express from "express";
import * as taskController from "../controllers/taskController";
import validate from "../middlewares/validate";
import { taskSchema } from "../validations/taskValidation";

const router = express.Router();

router.use((req, res, next) => {
  console.log("Time:", new Date());
  next();
});

router
  .route("/")
  .post(validate(taskSchema), taskController.createTask)
  .get(taskController.getAllTasks);

router
  .route("/:id")
  .get(taskController.getTask)
  .patch(validate(taskSchema), taskController.updateTask)
  .delete(taskController.deleteTask);

export default router;
