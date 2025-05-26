// models/todo.js
module.exports = (sequelize, DataTypes) => {
  const Todo = sequelize.define("Todo", {
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    dueDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    completed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
  });

  Todo.prototype.setCompletionStatus = async function (completed) {
    this.completed = completed;
    await this.save();
  };

  return Todo;
};
