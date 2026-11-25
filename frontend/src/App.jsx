import { useState, useEffect, useCallback } from 'react';
import { fetchTasks, createTask, updateTask, deleteTask } from './api/taskApi';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== 'all') params.status = statusFilter;

      const res = await fetchTasks(params);
      setTasks(res.data.data);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          'Failed to connect to backend server. Ensure Express & MongoDB are running.'
      );
    } finally {
      setLoading(false);
    }
  }, [search, statusFilter]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    try {
      setError('');
      const res = await createTask({ title, description, priority });
      setTasks((prev) => [res.data.data, ...prev]);
      setTitle('');
      setDescription('');
      setPriority('medium');
    } catch (err) {
      setError(err.response?.data?.message || 'Error creating task.');
    }
  };

  const handleToggleComplete = async (task) => {
    try {
      setError('');
      const res = await updateTask(task._id, { completed: !task.completed });
      setTasks((prev) =>
        prev.map((t) => (t._id === task._id ? res.data.data : t))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task status.');
    }
  };

  const handleSaveEdit = async (id) => {
    if (!editTitle.trim()) return;
    try {
      setError('');
      const res = await updateTask(id, { title: editTitle.trim() });
      setTasks((prev) => prev.map((t) => (t._id === id ? res.data.data : t)));
      setEditingId(null);
      setEditTitle('');
    } catch (err) {
      setError(err.response?.data?.message || 'Error updating task title.');
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      setError('');
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Error deleting task.');
    }
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>✅ MERN To-Do Manager</h1>
        <p>MongoDB + Express + React + Node.js Full-Stack CRUD</p>
      </header>

      {error && <div className="error-banner">⚠️ {error}</div>}

      <form className="task-form" onSubmit={handleAddTask}>
        <div className="form-row">
          <input
            type="text"
            placeholder="Task title (e.g., Complete MongoDB integration)..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option value="low">Low Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="high">High Priority</option>
          </select>
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Optional description..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit" className="add-btn">
            + Add Task
          </button>
        </div>
      </form>

      <div className="filter-bar">
        <input
          type="text"
          placeholder="🔍 Search tasks by title or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="filter-pills">
          {['all', 'pending', 'completed'].map((st) => (
            <button
              key={st}
              type="button"
              className={statusFilter === st ? 'pill active' : 'pill'}
              onClick={() => setStatusFilter(st)}
            >
              {st.charAt(0).toUpperCase() + st.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="status-text">Loading tasks from MongoDB...</p>
      ) : tasks.length === 0 ? (
        <p className="status-text">No tasks found. Add your first task above!</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task._id}
              className={`task-card ${task.completed ? 'completed' : ''}`}
            >
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => handleToggleComplete(task)}
              />

              <div className="task-body">
                {editingId === task._id ? (
                  <div className="edit-row">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                    />
                    <button
                      type="button"
                      className="save-btn"
                      onClick={() => handleSaveEdit(task._id)}
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      className="cancel-btn"
                      onClick={() => setEditingId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="task-top">
                      <h3>{task.title}</h3>
                      <span className={`badge ${task.priority}`}>
                        {task.priority}
                      </span>
                    </div>
                    {task.description && <p>{task.description}</p>}
                  </>
                )}
              </div>

              {editingId !== task._id && (
                <div className="task-actions">
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => {
                      setEditingId(task._id);
                      setEditTitle(task.title);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => handleDeleteTask(task._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;