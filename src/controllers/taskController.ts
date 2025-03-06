import Task from "../models/task";
import { Request, Response } from "express";
import mongoose from "mongoose";

const createTask = async (req: Request, res: Response): Promise<any> => {
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
};

const getAllTasks = async (req: Request, res: Response): Promise<void> => {
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
};

const getTask = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid task ID format",
            });
        }

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
};

const deleteTask = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid task ID format",
            });
        }

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
};

const updateTask = async (req: Request, res: Response): Promise<any> => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({
                status: "error",
                message: "Invalid task ID format",
            });
        }

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
};

export { createTask, getTask, getAllTasks, updateTask, deleteTask };
