import Task, { TaskDocument } from "../models/taskModel";
import { Request, Response, NextFunction } from "express";
import QueryBuilder from "../utils/queryBuilder";
import { catchAsync } from "../utils/catchAsync";

const createTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const { title, description, status } = req.body;

    const task = new Task({
      title,
      description,
      status
    });
    const data = await task.save();
    res.status(201).json({
      status: "success",
      data
    });
  }
);

const getAllTasks = catchAsync(
  async (req: Request, res: Response, next): Promise<void> => {
    console.log(req.query);

    const queryBuilder = new QueryBuilder<TaskDocument>(Task, req.query)
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
      return res.status(404).json({
        status: "error",
        message: `Task with ID ${req.params.id} not found`
      });
    }
    console.log("HERE!!");
    res.status(200).json({
      status: "success",
      data
    });
  }
);

const deleteTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const data = await Task.findByIdAndDelete(req.params.id);
    if (!data) {
      return res.status(404).json({
        status: "error",
        message: `Task with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      status: "success",
      message: `${data.title} with ID ${req.params.id} deleted successfully`
    });
  }
);

const updateTask = catchAsync(
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const data = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!data) {
      return res.status(404).json({
        status: "error",
        message: `Task with ID ${req.params.id} not found`
      });
    }

    res.status(200).json({
      status: "success",
      message: "Task updated successfully",
      data
    });
  }
);

export { createTask, getTask, getAllTasks, updateTask, deleteTask };
