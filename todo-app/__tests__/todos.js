const request = require("supertest");
const app = require("../app");
const db = require("../models");

describe("Todo app", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Create todo", async () => {
    const res = await request(app)
      .post("/todos")
      .send({ title: "Test todo", dueDate: "2025-06-01", _csrf: "test" });

    expect(res.statusCode).toBe(302); // redirect after create
  });

  test("Update todo as completed", async () => {
    const todo = await db.Todo.create({ title: "To complete", dueDate: "2025-06-01" });
    const res = await request(app)
      .put(`/todos/${todo.id}`)
      .send({ completed: true });

    expect(res.statusCode).toBe(200);
    const updated = await db.Todo.findByPk(todo.id);
    expect(updated.completed).toBe(true);
  });

  test("Delete todo", async () => {
    const todo = await db.Todo.create({ title: "Delete me", dueDate: "2025-06-01" });
    const res = await request(app).delete(`/todos/${todo.id}`);
    expect(res.statusCode).toBe(200);
  });
});
