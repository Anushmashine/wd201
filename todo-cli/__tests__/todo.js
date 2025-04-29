const { todoList, formattedDate, today } = require("./todo");

describe("Todo List Test Suite", () => {
  let todos;
  const yesterday = formattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  const tomorrow = formattedDate(new Date(new Date().setDate(new Date().getDate() + 1)));

  beforeEach(() => {
    todos = todoList();
  });

  // 1. Add a todo
  test("Adds a new todo", () => {
    todos.add({ title: 'Test', dueDate: today, completed: false });
    expect(todos.all.length).toBe(1);
  });

  // 2. Mark as complete
  test("Marks todo as complete", () => {
    todos.add({ title: 'Test', dueDate: today, completed: false });
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  // 3. Retrieve overdue
  test("Gets overdue items", () => {
    todos.add({ title: 'Overdue', dueDate: yesterday, completed: false });
    expect(todos.overdue().length).toBe(1);
  });

  // 4. Retrieve due today
  test("Gets due today items", () => {
    todos.add({ title: 'Today', dueDate: today, completed: false });
    expect(todos.dueToday().length).toBe(1);
  });

  // 5. Retrieve due later
  test("Gets due later items", () => {
    todos.add({ title: 'Later', dueDate: tomorrow, completed: false });
    expect(todos.dueLater().length).toBe(1);
  });
});
