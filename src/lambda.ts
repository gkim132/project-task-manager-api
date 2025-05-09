import serverless from "serverless-http";
import mongoose from "mongoose";
import app from "./app";

const MONGO_URI = process.env.MONGO_URI;

let isConnected = false;

const connectToDatabase = async () => {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI!);
    isConnected = true;
    console.log("Connected to MongoDB");
  }
};

export const taskHandler = async (event: any, context: any) => {
  await connectToDatabase();
  const handler = serverless(app);
  return handler(event, context);
};
export const userHandler = async (event: any, context: any) => {
  await connectToDatabase();
  const handler = serverless(app);
  return handler(event, context);
};

export const fileHandler = async (event: any, context: any) => {
  await connectToDatabase();
  const handler = serverless(app);
  return handler(event, context);
};
