'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {}

    static async addTask({ title, dueDate }) {
      return await Todo.create({ title, dueDate, completed: false });
    }

    static async getTodos() {
      return await Todo.findAll({ order: [['id', 'ASC']] });
    }

    static async remove(id) {
      return await Todo.destroy({ where: { id } });
    }

    static async updateStatus(id, completed) {
      return await Todo.update({ completed }, { where: { id } });
    }

    async setCompletionStatus(status) {
      this.completed = status;
      await this.save();
    }

    isOverdue() {
      return !this.completed && new Date(this.dueDate) < new Date();
    }

    isDueToday() {
      const today = new Date().toISOString().split("T")[0];
      return this.dueDate === today && !this.completed;
    }

    isDueLater() {
      const today = new Date().toISOString().split("T")[0];
      return this.dueDate > today && !this.completed;
    }
  }

  Todo.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: true,
        },
      },
      dueDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },
      completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: 'Todo',
    }
  );
  return Todo;
};
