import express from "express";
import * as taskController from "../controllers/taskController";

const router = express.Router();

router.use((req, res, next) => {
    console.log("Time:", new Date());
    next();
});

router
    .route("/")
    .post(taskController.createTask)
    .get(taskController.getAllTasks);

router
    .route("/:id")
    .get(taskController.getTask)
    .patch(taskController.updateTask)
    .delete(taskController.deleteTask);

export { router };
