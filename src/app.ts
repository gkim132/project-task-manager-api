import express from "express";
import taskRouter from "./routes/taskRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/tasks", taskRouter);

app.use(errorHandler);

export default app;
