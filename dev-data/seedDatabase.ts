import fs from "fs";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
import mongoose from "mongoose";
import Task from "../src/models/taskModel";

dotenv.config();

// Create random tasks
const createRandomTask = () => {
  return {
    title: faker.word.sample(100),
    description: faker.lorem.sentence(),
    status: faker.helpers.arrayElement(["pending", "in-progress", "completed"]),
    createdAt: faker.date.recent({ days: 365 })
  };
};
const tasks = Array.from({ length: 20 }, createRandomTask);

// Write JSON file
fs.writeFileSync(
  `${__dirname}/sampleTasks.json`,
  JSON.stringify(tasks, null, 2),
  "utf8"
);

const DB = process.env.DATABASE as string;

const connectDB = async () => {
  try {
    await mongoose.connect(DB);
    console.log("DB connected!");
  } catch (error) {
    console.error("DB connection failed:", error);
    process.exit(1);
  }
};

// Import sampleTask data into DB
const importData = async () => {
  await connectDB();
  try {
    await Task.create(tasks);
    console.log("Data successfully loaded!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// Delete all data from DB
const deleteData = async () => {
  await connectDB();
  try {
    await Task.deleteMany();
    console.log("Data successfully deleted!");
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.connection.close();
    process.exit();
  }
};

// CLI
if (process.argv[2] === "--import") {
  importData();
} else if (process.argv[2] === "--delete") {
  deleteData();
}
