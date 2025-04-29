const { todoList, formattedDate, today } = require("./todo");

describe("Todo List Test Suite", () => {
  let todos;

  const yesterday = formattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  const tomorrow = formattedDate(new Date(new Date().setDate(new Date().getDate() + 1)));

  beforeEach(() => {
    todos = todoList();
    todos.add({ title: 'Submit assignment', dueDate: yesterday, completed: false });
    todos.add({ title: 'Pay rent', dueDate: today, completed: true });
    todos.add({ title: 'Service Vehicle', dueDate: today, completed: false });
    todos.add({ title: 'File taxes', dueDate: tomorrow, completed: false });
    todos.add({ title: 'Complete project', dueDate: tomorrow, completed: false });
  });

  test("Should add a new todo", () => {
    const initialCount = todos.all.length;
    const newTodo = { title: 'New Todo', dueDate: today, completed: false };
    todos.add(newTodo);
    
    expect(todos.all.length).toBe(initialCount + 1);
    expect(todos.all).toContainEqual(expect.objectContaining(newTodo));
  });

  test("Should mark a todo as complete", () => {
    const incompleteTodoIndex = todos.all.findIndex(t => !t.completed && t.dueDate === today);
    todos.markAsComplete(incompleteTodoIndex);
    
    expect(todos.all[incompleteTodoIndex].completed).toBe(true);
    expect(todos.all.filter(t => t.completed).length).toBe(2); // Originally 1 completed
  });

  test("Should retrieve overdue items", () => {
    const overdues = todos.overdue();
    
    expect(overdues.length).toBe(1);
    expect(overdues[0].title).toBe("Submit assignment");
    expect(overdues.every(todo => todo.dueDate < today)).toBe(true);
  });

  test("Should retrieve due today items", () => {
    const dueTodays = todos.dueToday();
    
    expect(dueTodays.length).toBe(2);
    expect(dueTodays.some(t => t.title === "Pay rent" && t.completed)).toBe(true);
    expect(dueTodays.some(t => t.title === "Service Vehicle" && !t.completed)).toBe(true);
    expect(dueTodays.every(todo => todo.dueDate === today)).toBe(true);
  });

  test("Should retrieve due later items", () => {
    const dueLaters = todos.dueLater();
    
    expect(dueLaters.length).toBe(2);
    expect(dueLaters[0].title).toBe("File taxes");
    expect(dueLaters[1].title).toBe("Complete project");
    expect(dueLaters.every(todo => todo.dueDate > today)).toBe(true);
  });

  test("Should format todo items correctly", () => {
    const formattedToday = todos.toDisplayableList(todos.dueToday());
    const formattedOverdue = todos.toDisplayableList(todos.overdue());
    const formattedDueLater = todos.toDisplayableList(todos.dueLater());
    
    // Test today's items formatting
    expect(formattedToday).toContain("[x] Pay rent");
    expect(formattedToday).toContain("[ ] Service Vehicle");
    
    // Test overdue items formatting
    expect(formattedOverdue).toContain("[ ] Submit assignment");
    expect(formattedOverdue).toContain(yesterday);
    
    // Test due later items formatting
    expect(formattedDueLater).toContain("[ ] File taxes");
    expect(formattedDueLater).toContain(tomorrow);
  });
});
