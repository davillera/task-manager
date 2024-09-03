const User = require('./user');
const Task = require('./task');
const Comment = require('./comment');

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


Task.hasMany(Comment, {
  foreignKey: 'taskId',
  onDelete: 'CASCADE', // Asegura que los comentarios se eliminen si la tarea se elimina
  onUpdate: 'CASCADE',
});

Comment.belongsTo(Task, {
  foreignKey: 'taskId',
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
});

module.exports = {
  User,
  Task,
  Comment
};
