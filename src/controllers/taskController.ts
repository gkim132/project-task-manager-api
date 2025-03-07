import Task from "../models/task";
import { Request, Response } from "express";
import mongoose from "mongoose";

const isValidObjectId = (id: string): boolean =>
    mongoose.Types.ObjectId.isValid(id);

const createTask = async (req: Request, res: Response, next): Promise<any> => {
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
        next(error);
    }
};

const getAllTasks = async (
    req: Request,
    res: Response,
    next,
): Promise<void> => {
    try {
        const data = await Task.find({}).sort({ createdAt: -1 });
        res.status(200).json({
            status: "success",
            data,
        });
    } catch (error: unknown) {
        next(error);
    }
};

const getTask = async (req: Request, res: Response, next): Promise<any> => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid Task ID" });
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
        next(error);
    }
};

const deleteTask = async (req: Request, res: Response, next): Promise<any> => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid Task ID" });
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
        next(error);
    }
};

const updateTask = async (req: Request, res: Response, next): Promise<any> => {
    try {
        if (!isValidObjectId(req.params.id)) {
            return res
                .status(400)
                .json({ status: "error", message: "Invalid Task ID" });
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
        next(error);
    }
};

export { createTask, getTask, getAllTasks, updateTask, deleteTask };
