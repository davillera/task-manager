const express = require('express');
const router = express.Router();
const { createComment, getCommentsByTask, updateComment, deleteComment } = require('../controllers/comment');
const authMiddleware = require('../middlewares/auth');

// Aplicar middleware de autenticación a todas las rutas de comentarios
router.use(authMiddleware);

// Crear un nuevo comentario
router.post('/', createComment);

// Obtener todos los comentarios de una tarea
router.get('/task/:taskId', getCommentsByTask);

// Actualizar un comentario por su ID
router.put('/:id', updateComment);

// Eliminar un comentario por su ID
router.delete('/:id', deleteComment);

module.exports = router;
