const { todoList, formattedDate, today } = require("./todo");

describe("Todo List Test Suite", () => {
  let todos;
  const yesterday = formattedDate(new Date(new Date().setDate(new Date().getDate() - 1)));
  const tomorrow = formattedDate(new Date(new Date().setDate(new Date().getDate() + 1)));

  beforeEach(() => {
    todos = todoList();
    // Clear all todos before each test
    todos.all = [];
  });

  // Test Case 1: Add a new todo
  test("Adds a new todo", () => {
    const initialCount = todos.all.length;
    todos.add({ 
      title: 'New Todo', 
      dueDate: today, 
      completed: false 
    });
    expect(todos.all.length).toBe(initialCount + 1);
    expect(todos.all[0].title).toBe('New Todo');
    expect(todos.all[0].completed).toBe(false);
  });

  // Test Case 2: Mark a todo as complete
  test("Marks a todo as complete", () => {
    todos.add({ title: 'Test Todo', dueDate: today, completed: false });
    expect(todos.all[0].completed).toBe(false);
    todos.markAsComplete(0);
    expect(todos.all[0].completed).toBe(true);
  });

  // Test Case 3: Retrieve overdue items
  test("Retrieves overdue items", () => {
    todos.add({ title: 'Overdue Todo', dueDate: yesterday, completed: false });
    todos.add({ title: 'Today Todo', dueDate: today, completed: false });
    
    const overdueItems = todos.overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe('Overdue Todo');
    expect(overdueItems[0].dueDate).toBe(yesterday);
  });

  // Test Case 4: Retrieve due today items
  test("Retrieves due today items", () => {
    todos.add({ title: 'Today Todo 1', dueDate: today, completed: false });
    todos.add({ title: 'Today Todo 2', dueDate: today, completed: true });
    todos.add({ title: 'Tomorrow Todo', dueDate: tomorrow, completed: false });
    
    const dueTodayItems = todos.dueToday();
    expect(dueTodayItems.length).toBe(2);
    expect(dueTodayItems.some(todo => todo.title === 'Today Todo 1')).toBe(true);
    expect(dueTodayItems.some(todo => todo.title === 'Today Todo 2')).toBe(true);
  });

  // Test Case 5: Retrieve due later items
  test("Retrieves due later items", () => {
    todos.add({ title: 'Today Todo', dueDate: today, completed: false });
    todos.add({ title: 'Later Todo 1', dueDate: tomorrow, completed: false });
    todos.add({ title: 'Later Todo 2', dueDate: tomorrow, completed: true });
    
    const dueLaterItems = todos.dueLater();
    expect(dueLaterItems.length).toBe(2);
    expect(dueLaterItems.some(todo => todo.title === 'Later Todo 1')).toBe(true);
    expect(dueLaterItems.some(todo => todo.title === 'Later Todo 2')).toBe(true);
  });
});
