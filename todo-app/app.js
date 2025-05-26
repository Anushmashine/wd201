const express = require("express");
const path = require("path");
const { Todo } = require("./models");

const app = express();

// Middleware
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set EJS as view engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Routes
app.get("/", async (req, res) => {
  const todos = await Todo.findAll();
  res.render("index", { todos });
});

module.exports = app;
