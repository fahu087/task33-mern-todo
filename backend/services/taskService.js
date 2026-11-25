const Task = require('../models/Task');

async function getAllTasks({ search, status }) {
  const filter = {};
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
    ];
  }
  if (status === 'completed') filter.completed = true;
  if (status === 'pending') filter.completed = false;

  return Task.find(filter).sort({ createdAt: -1 });
}

async function createTask(data) {
  return Task.create(data);
}

async function updateTaskById(id, updates) {
  return Task.findByIdAndUpdate(id, updates, {
    new: true,
    runValidators: true,
  });
}

async function deleteTaskById(id) {
  return Task.findByIdAndDelete(id);
}

module.exports = {
  getAllTasks,
  createTask,
  updateTaskById,
  deleteTaskById,
};