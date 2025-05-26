const express = require("express");
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const path = require("path");
const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const { Todo } = require("./models");

const app = express();

// View engine setup
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Middleware setup
app.use(cookieParser());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// CSRF Protection
const csrfProtection = csrf({ cookie: true });
app.use(csrfProtection);

// Make CSRF token available to all views
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Routes
app.get("/", async (req, res) => {
  try {
    const todos = await Todo.findAll({ 
      order: [
        ["completed", "ASC"],
        ["dueDate", "ASC"],
        ["createdAt", "ASC"]
      ]
    });
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    res.render("index", {
      allTodos: todos,
      today: today.toISOString().slice(0, 10),
      csrfToken: req.csrfToken()
    });
  } catch (error) {
    console.error("Error loading todos:", error);
    res.status(500).render("error", { message: "Failed to load todos" });
  }
});

// Create new todo
app.post("/todos", async (req, res) => {
  try {
    const { title, dueDate } = req.body;
    
    // Server-side validation
    if (!title || !title.trim()) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    
    if (!dueDate) {
      return res.status(400).json({ error: "Due date cannot be empty" });
    }

    await Todo.create({
      title: title.trim(),
      dueDate,
      completed: false
    });
    
    res.redirect("/");
  } catch (error) {
    console.error("Error creating todo:", error);
    res.status(500).json({ error: "Failed to create todo" });
  }
});

// Update todo (completion status)
app.put("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    // Validate the completed status
    if (typeof req.body.completed !== "boolean") {
      return res.status(400).json({ error: "Invalid completion status" });
    }

    todo.completed = req.body.completed;
    await todo.save();
    
    res.json({ success: true });
  } catch (error) {
    console.error("Error updating todo:", error);
    res.status(500).json({ error: "Failed to update todo" });
  }
});

// Delete todo
app.delete("/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByPk(req.params.id);
    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    await todo.destroy();
    res.json({ success: true });
  } catch (error) {
    console.error("Error deleting todo:", error);
    res.status(500).json({ error: "Failed to delete todo" });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render("error", { message: "Something went wrong!" });
});

module.exports = app;
