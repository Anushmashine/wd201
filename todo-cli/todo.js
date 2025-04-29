const { todoList, formattedDate, today } = require("./todo");

describe("Todo List Test Suite", () => {
  let todos;
  const yesterday = formattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  const tomorrow = formattedDate(new Date(new Date().setDate(new Date().getDate() + 1)));

  beforeEach(() => {
    todos = todoList();
    // Only add minimal test data needed for these 5 tests
    todos.add({ title: 'Overdue Todo', dueDate: yesterday, completed: false });
    todos.add({ title: 'Today Todo', dueDate: today, completed: false });
  });

  // 1. Test adding a todo - should be FIRST and SIMPLE
  test("Adds a new todo", () => {
    const initialCount = todos.all.length;
    todos.add({ title: 'Test Todo', dueDate: today, completed: false });
    expect(todos.all.length).toBe(initialCount + 1);
  });

  // 2. Test marking complete - should be SECOND and SIMPLE
  test("Marks a todo as complete", () => {
    expect(todos.all[1].completed).toBe(false); // Today Todo
    todos.markAsComplete(1);
    expect(todos.all[1].completed).toBe(true);
  });

  // 3. Test overdue items - should be THIRD
  test("Retrieves overdue items", () => {
    const overdueItems = todos.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe('Overdue Todo');
  });

  // 4. Test due today items - should be FOURTH
  test("Retrieves due today items", () => {
    const dueTodayItems = todos.dueToday();
    expect(dueTodayItems.length).toBe(1);
    expect(dueTodayItems[0].title).toBe('Today Todo');
  });

  // 5. Test due later items - should be FIFTH
  test("Retrieves due later items", () => {
    todos.add({ title: 'Later Todo', dueDate: tomorrow, completed: false });
    const dueLaterItems = todos.dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe('Later Todo');
  });
});
