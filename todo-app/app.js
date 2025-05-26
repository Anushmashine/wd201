const express = require("express");
const app = express();
const csrf = require("csurf");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { Todo } = require("./models");

app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(csrf({ cookie: true }));
app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", async (req, res) => {
  const todos = await Todo.findAll();
  res.render("index", {
    overdue: todos.filter(t => t.isOverdue()),
    dueToday: todos.filter(t => t.isDueToday()),
    dueLater: todos.filter(t => t.isDueLater()),
    completed: todos.filter(t => t.completed),
    csrfToken: req.csrfToken(),
  });
});

app.post("/todos", async (req, res) => {
  const { title, dueDate } = req.body;
  if (!title || !dueDate) {
    return res.status(400).send("Title and dueDate are required");
  }
  await Todo.addTask({ title, dueDate });
  res.redirect("/");
});

app.put("/todos/:id", async (req, res) => {
  const todo = await Todo.findByPk(req.params.id);
  if (todo) {
    await todo.setCompletionStatus(req.body.completed);
    res.json(todo);
  } else {
    res.status(404).send("Not found");
  }
});

app.delete("/todos/:id", async (req, res) => {
  await Todo.remove(req.params.id);
  res.status(200).send("Deleted");
});

module.exports = app;
