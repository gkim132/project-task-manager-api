import request from "supertest";
import mongoose from "mongoose";
import app from "../src/app";

describe("Task API Endpoints", () => {
  let taskId: string;
  let consoleSpy;

  beforeAll(async () => {
    await mongoose.connect(process.env.DATABASE as string);
    consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
  });

  afterAll(async () => {
    await mongoose.connection.close();
    consoleSpy.mockRestore();
  });

  it("should create a new task", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
      status: "pending"
    });

    expect(response.status).toBe(201);
    expect(response.body.data).toMatchObject({
      title: "Test Task",
      description: "This is a test task",
      status: "pending"
    });

    taskId = response.body.data._id;
  });

  it("should get all tasks", async () => {
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
  });

  it("should get a task by ID", async () => {
    const response = await request(app).get(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      title: "Test Task",
      description: "This is a test task",
      status: "pending"
    });
  });

  it("should update a task", async () => {
    const response = await request(app).patch(`/tasks/${taskId}`).send({
      title: "Updated Task",
      status: "in-progress"
    });

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      title: "Updated Task",
      status: "in-progress"
    });
  });

  it("should delete a task", async () => {
    const response = await request(app).delete(`/tasks/${taskId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toContain("deleted successfully");
  });

  it("should return 404 for a non-existing task", async () => {
    const invalidId = "60c72b2f9b1e8b001f4f7f1a";
    const response = await request(app).get(`/tasks/${invalidId}`);

    expect(response.status).toBe(404);
  });

  it("should return 400 for status validation", async () => {
    const response = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "This is a test task",
      status: "fake status"
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toContain(
      "status must be one of the following values: pending, in-progress, completed"
    );
  });
});
