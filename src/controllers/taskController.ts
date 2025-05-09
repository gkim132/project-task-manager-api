import Task, { TaskDocument } from "../models/taskModel";
import { Request, Response, NextFunction } from "express";
import QueryBuilder from "../utils/queryBuilder";
import { catchAsync } from "../utils/catchAsync";
import BaseError from "../utils/baseError";
import { IUserRequest } from "../middleware/authMiddleware";
import { uploadToS3 } from "../utils/uploadToS3";

const createTask = catchAsync(
  async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const { title, description, status, imageUrl } = req.body;

    const task = new Task({
      title,
      description,
      status,
      createdBy: req.user._id,
      imageUrl
    });
    const data = await task.save();
    res.status(201).json({
      status: "success",
      data
    });
  }
);

const getAllTasks = catchAsync(
  async (req: IUserRequest, res: Response, next): Promise<void> => {
    const queryBuilder = new QueryBuilder<TaskDocument>(Task, req)
      .paginate()
      .filter()
      .sort();
    const data = await queryBuilder.query;
    const pagination = await queryBuilder.getPaginationMetadata();

    res.status(200).json({
      status: "success",
      pagination,
      size: data.length,
      data
    });
  }
);

const getTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const data = await Task.findById(req.params.id);
    if (!data) {
      throw new BaseError(`Task with ID ${req.params.id} not found`, 404);
    }
    res.status(200).json({
      status: "success",
      data
    });
  }
);

const deleteTask = catchAsync(
  async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new BaseError(`Task with ID ${req.params.id} not found`, 404);
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      throw new BaseError(
        "This task does not belong to you. You can not update it",
        403
      );
    }

    await Task.deleteOne({ _id: req.params.id });

    res.status(200).json({
      status: "success",
      message: `${task.title} with ID ${req.params.id} deleted successfully`
    });
  }
);

const deleteAllTasks = catchAsync(
  async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const task = await Task.deleteMany();

    res.status(200).json({
      status: "success",
      message: `All tasks(${task.deletedCount}) are deleted successfully`
    });
  }
);

const updateTask = catchAsync(
  async (
    req: IUserRequest,
    res: Response,
    next: NextFunction
  ): Promise<any> => {
    const task = await Task.findById(req.params.id);
    if (!task) {
      throw new BaseError(`Task with ID ${req.params.id} not found`, 404);
    }
    if (task.createdBy.toString() !== req.user._id.toString()) {
      throw new BaseError(
        "This task does not belong to you. You cannot update it.",
        403
      );
    }

    task.set(req.body);
    const updatedTask = await task.save();

    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data: updatedTask
    });
  }
);

export {
  createTask,
  getTask,
  getAllTasks,
  updateTask,
  deleteTask,
  deleteAllTasks
};
