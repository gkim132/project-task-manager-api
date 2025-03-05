import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import taskRouter from "./routes/taskRoutes";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE as string;

mongoose
    .connect(DB)
    .then(() => console.log("Database connected!"))
    .catch((error) => console.error("Database connection failed: ", error));

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.use("/tasks", taskRouter);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
