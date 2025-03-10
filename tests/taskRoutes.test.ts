import request from "supertest";
import app from "../src/app";

describe("Task API Endpoints", () => {
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
  });

  it("should get all tasks", async () => {
    const dataSize = 10;
    for (let i = 0; i < dataSize; i++) {
      await request(app)
        .post("/tasks")
        .send({
          title: `Task ${i}`,
          description: `This is task ${i}`,
          status: "pending"
        });
    }
    const response = await request(app).get("/tasks");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.data)).toBe(true);
    expect(response.body.data.length).toBe(dataSize);
  });

  it("should get a task by ID", async () => {
    const createdTask = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "Task to test GET by ID",
      status: "pending"
    });

    const response = await request(app).get(
      `/tasks/${createdTask.body.data._id}`
    );

    expect(response.status).toBe(200);
    expect(response.body.data).toMatchObject({
      title: "Test Task",
      description: "Task to test GET by ID",
      status: "pending"
    });
  });

  it("should patch a task", async () => {
    const createdTask = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "Task to test PATCH by ID",
      status: "pending"
    });

    const response = await request(app)
      .patch(`/tasks/${createdTask.body.data._id}`)
      .send({
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
    const createdTask = await request(app).post("/tasks").send({
      title: "Test Task",
      description: "Task to test DELETE by ID",
      status: "pending"
    });

    const response = await request(app).delete(
      `/tasks/${createdTask.body.data._id}`
    );

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

  describe("Task API Pagination", () => {
    it("should return paginated tasks", async () => {
      const dataSize = 25;
      const page = 1;
      const limit = 10;
      const totalPages = Math.ceil(dataSize / limit);
      for (let i = 0; i < dataSize; i++) {
        await request(app)
          .post("/tasks")
          .send({
            title: `Task ${i}`,
            description: `This is task ${i}`,
            status: "pending"
          });
      }
      const response = await request(app).get(
        `/tasks?page=${page}&limit=${limit}`
      );
      console.log(response.body.size);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("pagination");
      expect(response.body.pagination.currentPage).toBe(page);
      expect(response.body.pagination.limit).toBe(limit);
      expect(response.body.pagination.totalTasks).toBe(dataSize);
      expect(response.body.pagination.totalPages).toBe(totalPages);
      expect(response.body.size).toBe(limit);
    });
  });
});
