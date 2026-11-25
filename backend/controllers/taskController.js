const mongoose = require('mongoose');
const taskService = require('../services/taskService');

exports.getTasks = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const tasks = await taskService.getAllTasks({ search, status });
    res.status(200).json({ success: true, count: tasks.length, data: tasks });
  } catch (err) {
    next(err);
  }
};

exports.addTask = async (req, res, next) => {
  try {
    const { title, description, priority } = req.body;
    if (!title || !title.trim()) {
      return res
        .status(400)
        .json({ success: false, message: 'Task title is required.' });
    }
    const task = await taskService.createTask({ title, description, priority });
    res.status(201).json({ success: true, data: task });
  } catch (err) {
    next(err);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Task ID.' });
    }
    const updated = await taskService.updateTaskById(id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.status(200).json({ success: true, data: updated });
  } catch (err) {
    next(err);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid Task ID.' });
    }
    const deleted = await taskService.deleteTaskById(id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Task not found.' });
    }
    res.status(200).json({ success: true, message: 'Task deleted.', id });
  } catch (err) {
    next(err);
  }
};