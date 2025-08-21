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
    <div className="min-h-screen bg-gray-100 flex items-start justify-center py-10">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg p-6 flex flex-col" style={{maxHeight: '80vh'}}>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-extrabold text-gray-800">Task List</h1>
          <div className="flex gap-2">
            <input
              type="text"
              className="border rounded-md px-4 py-2 w-72 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Add a new task..."
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleAddTask()}
            />
            <button
              // onClick={handleAddTask}
              className="bg-indigo-600 text-white font-semibold px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Add
            </button>
          </div>
        </div>

        <div className="overflow-x-auto flex-1">
          <table className="min-w-full table-fixed divide-y divide-gray-200">
            <thead className="sr-only">
              <tr>
                <th>Check</th>
                <th>Title</th>
                <th>Edit</th>
                <th>Delete</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100" style={{display: 'block', maxHeight: '50vh', overflow: 'auto'}}>
              {tasks.map((task, idx) => (
                <tr key={task.id} className="hover:bg-gray-50" style={{display: 'table', tableLayout: 'fixed', width: '100%'}}>
                  {/* first col: checkbox */}
                  <td className="px-3 py-3 text-center w-16">
                    <input
                      aria-label={`Toggle ${task.title}`}
                      type="checkbox"
                      checked={task.isDone}
                      onChange={() => handleToggleDone(task.id, task.isDone)}
                      className="h-5 w-5 text-indigo-600 rounded focus:ring-0"
                    />
                  </td>

                  {/* second col: title */}
                  <td className="px-3 py-3 text-left pr-24">
                    <div className="min-w-0">
                      {editingId === task.id ? (
                        <div className="flex items-center gap-2">
                          <input
                            value={editingTitle}
                            onChange={e => setEditingTitle(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === 'Enter') handleSaveEdit(task.id);
                              if (e.key === 'Escape') handleCancelEdit();
                            }}
                            className="border rounded-md px-3 py-1 w-full min-w-0 pr-8"
                          />
                        </div>
                      ) : (
                        <div className="flex items-center gap-3">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            <span className={task.isDone ? 'line-through text-gray-400' : ''}>{task.title}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>

                  {/* third col: edit */}
                  <td className="px-3 py-3 text-right w-20">
                    {editingId === task.id ? (
                      <div className="flex gap-2 justify-end">
                        <button onClick={() => handleSaveEdit(task.id)} className="text-sm text-green-600 px-2">Save</button>
                        <button onClick={handleCancelEdit} className="text-sm text-gray-500 px-2">Cancel</button>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleStartEdit(task)}
                        className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-indigo-600 hover:bg-indigo-50 border border-transparent"
                        title="Edit"
                      >
                        ✏️
                      </button>
                    )}
                  </td>

                  {/* fourth col: delete */}
                  <td className="px-3 py-3 text-right w-20">
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-md text-red-600 hover:bg-red-50 border border-transparent"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Tasks;
