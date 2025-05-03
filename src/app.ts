import express from "express";
import morgan from "morgan";
import taskRouter from "./routes/taskRoutes";
import userRouter from "./routes/userRoutes";
import uploadRouter from "./routes/uploadRoutes";
import errorMiddleware from "./middleware/errorMiddleware";
import BaseError from "./utils/baseError";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use(`/tasks`, taskRouter);
app.use(`/user`, userRouter);
app.use("/files", uploadRouter);

app.all("*", (req, res, next) => {
  next(new BaseError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorMiddleware);

export default app;
