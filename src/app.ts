import express from "express";
import taskRouter from "./routes/taskRoutes";
import errorMiddleware from "./middleware/errorMiddleware";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/tasks", taskRouter);

app.use(errorMiddleware);

export default app;
