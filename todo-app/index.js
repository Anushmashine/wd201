const express = require("express");
const app = express();
const csrf = require("csurf");
const methodOverride = require("method-override");
const bodyParser = require("body-parser");
const { Todo } = require("./models");

const csrfProtection = csrf({ cookie: false });

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(csrfProtection);

app.get("/", async (req, res) => {
  try {
    const allTodos = {
      overdue: await Todo.overdue(),
      dueToday: await Todo.dueToday(),
      dueLater: await Todo.dueLater(),
      completed: await Todo.completed(),
    };

    res.render("index", {
      allTodos,
      csrfToken: req.csrfToken(),
      today: new Date().toISOString().split("T")[0],
    });
  } catch (err) {
    console.error("Error rendering index:", err);
    res.status(500).send("Something went wrong.");
  }
});
