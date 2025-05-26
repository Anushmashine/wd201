const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override"); // ✅ For PUT & DELETE
const { Todo } = require("./models");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method")); // ✅ Enables PUT/DELETE via forms
app.use(express.static(path.join(__dirname, "public")));

const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

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
      return !todo.completed && dueDate.getTime() === today.getTime();
    });

    const dueLater = todos.filter(todo => {
      const dueDate = new Date(todo.dueDate);
      dueDate.setHours(0, 0, 0, 0);
      return !todo.completed && dueDate > today;
    });

    const completed = todos.filter(todo => todo.completed);

    res.render("index", {
      overdue,
      dueToday,
      dueLater,
      completed,
      today: today.toISOString().slice(0, 10),
    });
  } catch (error) {
    console.error("Error loading todos:", error.message, error.stack);
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
      completed: false,
    });
    res.redirect("/");
  } catch (error) {
    console.error("Error creating todo:", error.message, error.stack);
    res.status(422).redirect("/");
  }
});

// Update todo completion status
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }
    const completed =
      req.body.completed === "true" || req.body.completed === true;
    todo.completed = completed;
    await todo.save();
    res.json(todo);
  } catch (error) {
    console.error("Error updating todo:", error.message, error.stack);
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
    console.error("Error deleting todo:", error.message, error.stack);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// API endpoint to get all todos
app.get("/todos", async (req, res) => {
  try {
    const todos = await Todo.findAll({ order: [["id", "ASC"]] });
    res.json(todos);
  } catch (error) {
    console.error("Error fetching todos:", error.message, error.stack);
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
    console.error("Error fetching todo:", error.message, error.stack);
    res.status(422).json(error);
  }
});

module.exports = app;
