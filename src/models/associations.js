const User = require('./user');
const Task = require('./task');

// Un usuario tiene muchas tareas
User.hasMany(Task, {
  foreignKey: 'userId',
  as: 'tasks',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

// Una tarea pertenece a un usuario
Task.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onUpdate: 'CASCADE',
  onDelete: 'CASCADE',
});

module.exports = {
  User,
  Task,
};
