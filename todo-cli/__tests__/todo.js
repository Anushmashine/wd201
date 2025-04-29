const { all, add, markAsComplete, overdue, dueToday, dueLater, toDisplayableList } = require('../todo.js');
const today = new Date().toISOString().split("T")[0];

describe("Todo Test Suite", () => {
  beforeAll(() => {
    // Seed test data
    add({ title: "Test overdue", dueDate: "2020-01-01", completed: false });
    add({ title: "Test due today", dueDate: today, completed: false });
    add({ title: "Test due later", dueDate: "2030-01-01", completed: false });
  });

  test("Should add a new todo", () => {
    const todoItemsCount = all.length;
    add({ title: "Test todo", dueDate: today, completed: false });
    expect(all.length).toBe(todoItemsCount + 1);
  });

  test("Should mark a todo as complete", () => {
    expect(all[0].completed).toBe(false);
    markAsComplete(0);
    expect(all[0].completed).toBe(true);
  });

  test("Should retrieve overdue items", () => {
    const overdueItems = overdue();
    expect(overdueItems.length).toBe(1);
    expect(overdueItems[0].title).toBe("Test overdue");
  });

  test("Should retrieve due today items", () => {
    const dueTodayItems = dueToday();
    expect(dueTodayItems.length).toBe(2); // Includes the one added in the first test
    expect(dueTodayItems[0].title).toBe("Test due today");
  });

  test("Should retrieve due later items", () => {
    const dueLaterItems = dueLater();
    expect(dueLaterItems.length).toBe(1);
    expect(dueLaterItems[0].title).toBe("Test due later");
  });

  test("Should format todos for display", () => {
    const displayableList = toDisplayableList(all);
    expect(displayableList).toContain("[x] Test overdue 2020-01-01");
    expect(displayableList).toContain("[ ] Test due today");
    expect(displayableList).toContain("[ ] Test due later 2030-01-01");
  });
});
