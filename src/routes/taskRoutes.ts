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
            error: (error as Error).message,
        });
    }
});

export default taskRouter;
