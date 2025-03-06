import Task from "../models/task";
import express from "express";

const taskRouter = express.Router();

taskRouter.use((req, res, next) => {
    console.log("Time:", new Date());
    next();
});

taskRouter.post("/", async (req, res): Promise<any> => {
    const { title, description, status } = req.body;
    if (!title) {
        return res.status(400).json({ error: "Title is required" });
    }

    try {
        const task = new Task({
            title,
            description,
            status,
        });
        const data = await task.save();
        res.status(201).json({
            status: "success",
            data,
        });
    } catch (error: unknown) {
        console.error("Error saving task:", error);
        res.status(500).json({
            status: "error",
            message: (error as Error).message,
        });
    }
});

taskRouter.get("/", async (req, res): Promise<void> => {
    try {
        const data = await Task.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error: unknown) {
        console.error("Error fetching all task:", error);
        res.status(500).json({
            status: "error",
            message: (error as Error).message,
        });
    }
});

taskRouter.get("/:id", async (req, res): Promise<any> => {
    try {
        const data = await Task.findById(req.params.id);
        if (!data) {
            return res.status(404).json({
                status: "error",
                message: `Task with ID ${req.params.id} not found`,
            });
        }

        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error: unknown) {
        console.error("Error fetching task:", error);
        res.status(500).json({
            status: "error",
            message: (error as Error).message,
        });
    }
});

taskRouter.delete("/:id", async (req, res): Promise<any> => {
    try {
        const data = await Task.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(404).json({
                status: "error",
                message: `Task with ID ${req.params.id} not found`,
            });
        }

        res.status(200).json({
            status: "success",
            message: `${data.title} with ID ${req.params.id} deleted successfully`,
        });
    } catch (error: unknown) {
        console.error("Error deleting task:", error);
        res.status(500).json({
            status: "error",
            message: (error as Error).message,
        });
    }
});

taskRouter.patch("/:id", async (req, res): Promise<any> => {
    try {
        const { title, description, status } = req.body;
        const data = await Task.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!data) {
            return res.status(404).json({
                status: "error",
                message: `Task with ID ${req.params.id} not found`,
            });
        }

        res.status(200).json({
            status: "success",
            message: "Task updated successfully",
            data,
        });
    } catch (error: unknown) {
        console.error("Error updating task:", error);
        res.status(500).json({
            status: "error",
            message: (error as Error).message,
        });
    }
});

export default taskRouter;
