const express = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");

// Middleware to parse JSON and form-urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = [];
    const dueToday = [];
    const dueLater = [];

    todos.forEach((todo) => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);

      if (!todo.completed && dueDate < today) {
        overdue.push(todo);
      } else if (dueDate.getTime() === today.getTime()) {
        dueToday.push(todo);
      } else {
        dueLater.push(todo);
      }
    });

    res.render("index", { overdue, dueToday, dueLater });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error loading todos");
  }
});

app.get("/todos", async function (_request, response) {
  try {
    const todos = await Todo.findAll({
      order: [["id", "ASC"]],
    });
    return response.json(todos);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

app.get("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }
    return response.json(todo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.post("/todos", async function (request, response) {
  try {
    const { title, dueDate } = request.body;
    if (!title || !dueDate) {
      return response.redirect("/");
    }
    await Todo.create({ title, dueDate, completed: false });
    return response.redirect("/");
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.put("/todos/:id/markAsCompleted", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.markAsCompleted();
    return response.json(updatedTodo);
  } catch (error) {
    console.log(error);
    return response.status(422).json(error);
  }
});

app.delete("/todos/:id", async function (request, response) {
  try {
    const todo = await Todo.findByPk(request.params.id);
    if (!todo) {
      return response.json(false);
    }
    await todo.destroy();
    return response.json(true);
  } catch (error) {
    console.log(error);
    return response.status(500).json({ error: "Internal server error" });
  }
});

module.exports = app;

