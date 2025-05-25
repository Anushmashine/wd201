const express = require("express");
const app = express();
const { Todo } = require("./models");
const path = require("path");
const bodyParser = require("body-parser");

// Middleware setup
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Root route - renders the todo list
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const overdue = todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return !todo.completed && dueDate < today;
    });

    const dueToday = todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate.getTime() === today.getTime();
    });

    const dueLater = todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return dueDate > today;
    });

    res.render("index", { 
      overdue,
      dueToday, 
      dueLater,
      today: today.toISOString().slice(0, 10) // For form default date
    });
  } catch (error) {
    console.error("Error loading todos:", error);
    res.status(500).send("Internal Server Error");
  }
});

// Create new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    if (!title || !dueDate) {
      return res.status(400).redirect("/");
    }
    await Todo.create({ 
      title: title.trim(),
      dueDate,
      completed: false 
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(422).redirect("/");
  }
});

// Mark todo as completed
app.put("/todos/:id/markAsCompleted", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const updatedTodo = await todo.update({ completed: true });
    res.json(updatedTodo);
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(422).json(error);
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.json(false);
    }
    await todo.destroy();
    res.json(true);
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get single todo
app.get("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json(todo);
  } catch (error) {
    console.error("Error fetching todo:", error);
    res.status(422).json(error);
  }
});

module.exports = app;
