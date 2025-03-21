import mongoose, { Document, ObjectId, Schema } from "mongoose";

export type TaskDocument = Document & {
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  createdBy: ObjectId;
  createdAt: Date;
};

const taskSchema = new Schema<TaskDocument>({
  title: { type: String, required: true },
  description: String,
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending"
  },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now }
});

const Task = mongoose.model<TaskDocument>("Task", taskSchema);

export default Task;
