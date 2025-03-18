import express from "express";
import taskRouter from "./routes/taskRoutes";
import userRouter from "./routes/userRoutes";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/tasks", taskRouter);
app.use("/user", userRouter);

app.use(errorMiddleware);

export default app;
