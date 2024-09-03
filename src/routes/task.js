const express = require('express');
const router = express.Router();
const {
  createTask,
  getTasks,
  searchTasks,
  updateTask,
  deleteTask,
  getTaskById
} = require('../controllers/task');
const authMiddleware = require('../middlewares/auth');
const upload = require('../middlewares/Multer');

// Aplicar el middleware de autenticación a todas las rutas
router.use(authMiddleware);

// Crear una nueva tarea (con posibilidad de subir una imagen)
router.post('/', upload.single('image'), createTask);

// Obtener todas las tareas
router.get('/', getTasks);

// Buscar tareas
router.get('/search', searchTasks);

// Obtener una tarea por ID
router.get('/:id', getTaskById);

// Actualizar una tarea por ID (con posibilidad de actualizar la imagen)
router.put('/:id', upload.single('image'), updateTask);

// Eliminar una tarea por ID
router.delete('/:id', deleteTask);

module.exports = router;
