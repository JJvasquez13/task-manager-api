const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const validateTask = require('../middleware/validateTask');

router.get('/', taskController.getAllTasks);
router.get('/:id', taskController.getTaskById);
router.get('/by-title/:title', taskController.getTaskByTitle);
router.post('/', validateTask, taskController.createTask);
router.put('/:id', validateTask, taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

module.exports = router;
