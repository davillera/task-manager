const { Op } = require('sequelize');
const Task = require('../models/task');

// Crear una nueva tarea
exports.createTask = async (req, res) => {
  try {
    const { title, description, userId } = req.body;
    const task = await Task.create({ title, description, userId });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener todas las tareas del usuario autenticado
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.findAll({ where: { userId: req.user.id } });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Buscar tareas utilizando filtros (título, descripción y estado)
exports.searchTasks = async (req, res) => {
  try {
    const { query, completed } = req.query;
    const userId = req.user.id;

    // Construir la cláusula WHERE dinámica
    let whereClause = {
      userId: userId,
    };

    // Si hay un query, añadir la condición de búsqueda
    if (query) {
      whereClause = {
        ...whereClause,
        [Op.or]: [
          { title: { [Op.like]: `%${query}%` } },
          { description: { [Op.like]: `%${query}%` } },
        ],
      };
    }

    // Si completed está definido, añadirlo a la condición
    if (completed !== undefined) {
      whereClause.completed = completed === 'true';
    }

    // Ejecutar la búsqueda con la cláusula where
    const tasks = await Task.findAll({ where: whereClause });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una tarea por su ID
exports.updateTask = async (req, res) => {
  try {
    const { title, description, completed } = req.body;
    const task = await Task.findByPk(req.params.id);

    if (task && task.userId === req.user.id) {
      task.title = title || task.title;
      task.description = description || task.description;
      task.completed = completed !== undefined ? completed : task.completed;

      await task.save();
      res.status(200).json(task);
    } else {
      res.status(404).json({ error: 'Task not found or you do not have access' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una tarea por su ID
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findByPk(req.params.id);
    if (task && task.userId === req.user.id) {
      await task.destroy();
      res.status(204).end();
    } else {
      res.status(404).json({ error: 'Task not found or you do not have access' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
