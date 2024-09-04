const { Op } = require('sequelize');
const Task = require('../models/task');
const { uploadFile } = require('../config/aws');

exports.createTask = async (req, res) => {
  try {
    let imageUrl = null;
    if (req.file) {
      imageUrl = await uploadFile(req.file);
    }

    const task = await Task.create({
      title: req.body.title,
      description: req.body.description,
      imageUrl: imageUrl
    });

    res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
};

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

exports.getTaskById = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findByPk(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' }); 
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
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
    const taskId = req.params.id;

    const task = await Task.findByPk(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    let imageUrl = task.imageUrl;
    if (req.file) {
      imageUrl = await uploadFile(req.file);
    }

    task.title = req.body.title || task.title;
    task.description = req.body.description || task.description;
    task.imageUrl = imageUrl;
    task.completed = req.body.completed

    await task.save();

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
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
