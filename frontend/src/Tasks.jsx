import { useEffect, useState } from 'react';
import api from "./api/axios";

function Tasks() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");

  const sortByIdDesc = (arr) => (Array.isArray(arr) ? arr.slice().sort((a, b) => (b.id ?? 0) - (a.id ?? 0)) : []);

  useEffect(() => {
    api.get('/tasks')
      .then(res => setTasks(Array.isArray(res.data) ? sortByIdDesc(res.data) : []))
      .catch(err => console.error(err));
  }, []);

  const handleAddTask = async () => {
    if (!newTask.trim()) return;
    try {
      const res = await api.post('/tasks', { title: newTask, userId: 1 }); // userId: 1 acts as a placeholder for the logged-in user
      setTasks(prev => sortByIdDesc([res.data, ...prev]));
      setNewTask("");
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleDone = async (id, isDone) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (!task) return;
      const payload = { title: task.title, isDone: !isDone };
      await api.put(`/tasks/${id}`, payload);
      setTasks(prev => sortByIdDesc(prev.map(t => t.id === id ? { ...t, isDone: !isDone } : t)));
    } catch (err) {
      console.error(err);
    }
  };  

  const handleStartEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const handleSaveEdit = async (id) => {
    const trimmed = editingTitle.trim();
    if (!trimmed) return;
    try {
      const task = tasks.find(t => t.id === id);
      const payload = { title: trimmed, isDone: task?.isDone ?? false };
      await api.put(`/tasks/${id}`, payload);
      setTasks(prev => sortByIdDesc(prev.map(t => t.id === id ? { ...t, title: trimmed } : t)));
      handleCancelEdit();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            {task.title} {task.isDone ? '✅' : '❌'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Tasks;
