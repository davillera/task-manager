const Comment = require('../models/comment');
const Task = require('../models/task');

// Crear un nuevo comentario
exports.createComment = async (req, res) => {
  try {
    const { content, taskId } = req.body;
    const userId = req.user.id; // Obtiene el userId desde el token JWT

    // Verificar si la tarea existe
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comment = await Comment.create({ content, taskId, userId });
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todos los comentarios de una tarea específica
exports.getCommentsByTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Verificar si la tarea existe
    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const comments = await Comment.findAll({ where: { taskId } });
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un comentario
exports.updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment || comment.userId !== userId) {
      return res.status(404).json({ error: 'Comment not found or you do not have access' });
    }

    comment.content = content || comment.content;
    await comment.save();

    res.status(200).json(comment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un comentario
exports.deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const comment = await Comment.findByPk(id);

    if (!comment || comment.userId !== userId) {
      return res.status(404).json({ error: 'Comment not found or you do not have access' });
    }

    await comment.destroy();
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
