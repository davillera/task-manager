const express = require('express');
const router = express.Router();
const { createTask, getTasks, searchTasks, updateTask, deleteTask } = require('../controllers/task');
const authMiddleware = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', createTask);

router.get('/', getTasks);

router.get('/search', searchTasks);

router.put('/:id', updateTask);

router.delete('/:id', deleteTask);

module.exports = router;
