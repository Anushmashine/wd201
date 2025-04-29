const { todoList, formattedDate, today } = require("../todo");

describe("Todo List Test Suite", () => {
  let todos;

  beforeAll(() => {
    todos = todoList();
  });

  test("Add new todo", () => {
    const todoItemsCount = todos.all.length;
    todos.add({
      title: "Test todo",
      dueDate: today,
      completed: false,
    });
    expect(todos.all.length).toBe(todoItemsCount + 1);
  });

  test("Mark todo as complete", () => {
    todos.add({
      title: "Test todo",
      dueDate: today,
      completed: false,
    });
    expect(todos.all[todos.all.length - 1].completed).toBe(false);
    todos.markAsComplete(todos.all.length - 1);
    expect(todos.all[todos.all.length - 1].completed).toBe(true);
  });

  test("Check overdue items", () => {
    const yesterday = formattedDate(
      new Date(new Date().setDate(new Date().getDate() - 1))
    );
    todos.add({
      title: "Overdue todo",
      dueDate: yesterday,
      completed: false,
    });
    expect(todos.overdue().length).toBe(1);
  });

  test("Check due today items", () => {
    todos.add({
      title: "Due today todo",
      dueDate: today,
      completed: false,
    });
    expect(todos.dueToday().length).toBeGreaterThanOrEqual(1);
  });

  test("Check due later items", () => {
    const tomorrow = formattedDate(
      new Date(new Date().setDate(new Date().getDate() + 1))
    );
    todos.add({
      title: "Due later todo",
      dueDate: tomorrow,
      completed: false,
    });
    expect(todos.dueLater().length).toBe(1);
  });
});
