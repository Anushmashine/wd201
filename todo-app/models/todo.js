"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      // define association here
    }

    static async addTodo({ title, dueDate }) {
      return this.create({ 
        title: title, 
        dueDate: dueDate, 
        completed: false 
      });
    }

    static async getTodos() {
      return this.findAll({
        order: [['dueDate', 'ASC']] // Sort by due date ascending
      });
    }

    static async getOverdueTodos() {
      return this.findAll({
        where: {
          dueDate: { [sequelize.Sequelize.Op.lt]: new Date() },
          completed: false
        },
        order: [['dueDate', 'ASC']]
      });
    }

    static async getDueTodayTodos() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      return this.findAll({
        where: {
          dueDate: {
            [sequelize.Sequelize.Op.gte]: today,
            [sequelize.Sequelize.Op.lt]: tomorrow
          },
          completed: false
        },
        order: [['dueDate', 'ASC']]
      });
    }

    static async getCompletedTodos() {
      return this.findAll({
        where: {
          completed: true
        },
        order: [['dueDate', 'ASC']]
      });
    }

    static async deleteTodo(id) {
      const deletedRows = await this.destroy({
        where: { id }
      });
      return deletedRows > 0;
    }

    markAsCompleted() {
      return this.update({ completed: true });
    }

    markAsIncomplete() {
      return this.update({ completed: false });
    }

    setCompletionStatus(status) {
      return this.update({ completed: status });
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: true,
          notEmpty: true
        }
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        validate: {
          notNull: true,
          isDate: true
        }
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
      }
    },
    {
      sequelize,
      modelName: "Todo",
      tableName: "todos",
      timestamps: false
    }
  );

  return Todo;
};