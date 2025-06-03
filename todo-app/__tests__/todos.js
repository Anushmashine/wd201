const request = require("supertest");
const db = require("../models");
const app = require("../app");

describe("Todo Test Suite", () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true });
  });

  test("Creates a todo and responds with redirect at /todos POST endpoint", async () => {
    // First fetch CSRF token from GET / to use in POST
    const getRes = await request(app).get("/");
    const csrfToken = extractCsrfToken(getRes.text);

    const response = await request(app)
      .post("/todos")
      .set("Cookie", getRes.headers["set-cookie"]) // pass cookies to keep session
      .send({
        title: "Test todo",
        dueDate: "2025-04-15",
        _csrf: csrfToken,
      });

    expect(response.statusCode).toBe(302); // redirect on success
  });

  test("Fetches all todos in the database using / endpoint", async () => {
    const response = await request(app).get("/");
    expect(response.statusCode).toBe(200);
    expect(response.text).toContain("Test todo"); // basic content check
  });

  test("Updates a todo's completion status with PUT /todos/:id", async () => {
    const todo = await db.Todo.create({
      title: "Todo to update",
      dueDate: "2025-04-16",
      completed: false,
    });

    // Get CSRF token
    const getRes = await request(app).get("/");
    const csrfToken = extractCsrfToken(getRes.text);

    const response = await request(app)
      .put(`/todos/${todo.id}`)
      .set("Cookie", getRes.headers["set-cookie"])
      .send({
        completed: true,
        _csrf: csrfToken,
      });

    expect(response.statusCode).toBe(200);

    // Verify update
    const updatedTodo = await db.Todo.findByPk(todo.id);
    expect(updatedTodo.completed).toBe(true);
  });

  test("Deletes a todo with the given ID if it exists", async () => {
    const todo = await db.Todo.create({
      title: "Todo to delete",
      dueDate: "2025-04-17",
      completed: false,
    });

    // Get CSRF token
    const getRes = await request(app).get("/");
    const csrfToken = extractCsrfToken(getRes.text);

    const response = await request(app)
      .delete(`/todos/${todo.id}`)
      .set("Cookie", getRes.headers["set-cookie"])
      .send({ _csrf: csrfToken });

    expect(response.statusCode).toBe(200); // 200 OK on successful delete

    // Verify deletion
    const deletedTodo = await db.Todo.findByPk(todo.id);
    expect(deletedTodo).toBeNull();
  });

  test("Fails to create todo with empty title or dueDate", async () => {
    // Get CSRF token
    const getRes = await request(app).get("/");
    const csrfToken = extractCsrfToken(getRes.text);

    const response1 = await request(app)
      .post("/todos")
      .set("Cookie", getRes.headers["set-cookie"])
      .send({
        title: "",
        dueDate: "2025-04-18",
        _csrf: csrfToken,
      });
    expect(response1.statusCode).toBe(400);

    const response2 = await request(app)
      .post("/todos")
      .set("Cookie", getRes.headers["set-cookie"])
      .send({
        title: "No date",
        dueDate: "",
        _csrf: csrfToken,
      });
    expect(response2.statusCode).toBe(400);
  });

  afterAll(async () => {
    await db.sequelize.close();
  });
});

// Helper function to extract CSRF token from the rendered HTML
function extractCsrfToken(html) {
  const match = html.match(/name="_csrf" value="(.+?)"/);
  return match ? match[1] : null;
}

