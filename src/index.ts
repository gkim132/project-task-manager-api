import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DB = process.env.DATABASE as string;

mongoose
    .connect(DB)
    .then(() => console.log("Database connected!"))
    .catch((error) => console.error("Database connection failed: ", error));

app.get("/", (req, res) => {
    res.send("Server is running!");
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
