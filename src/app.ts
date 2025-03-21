import express from "express";
import taskRouter from "./routes/taskRoutes";
import userRouter from "./routes/userRoutes";
import errorMiddleware from "./middleware/errorMiddleware";
import BaseError from "./utils/baseError";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/tasks", taskRouter);
app.use("/user", userRouter);

app.all("*", (req, res, next) => {
  next(new BaseError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

export default app;
