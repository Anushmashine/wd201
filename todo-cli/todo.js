// todo.js
const formattedDate = (d) => {
  return d.toISOString().split("T")[0];
};

const today = formattedDate(new Date());

const todoList = () => {
  let all = [];
  
  const add = (todoItem) => {
    all.push(todoItem);
  };
  
  const markAsComplete = (index) => {
    all[index].completed = true;
  };
  
  const overdue = () => {
    return all.filter((item) => item.dueDate < today);
  };
  
  const dueToday = () => {
    return all.filter((item) => item.dueDate === today);
  };
  
  const dueLater = () => {
    return all.filter((item) => item.dueDate > today);
  };
  
  return {
    all,
    add,
    markAsComplete,
    overdue,
    dueToday,
    dueLater
  };
};

module.exports = { todoList, formattedDate, today };
