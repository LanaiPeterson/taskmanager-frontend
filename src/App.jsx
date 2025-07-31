import React, { useState, useEffect } from "react";
import axios from "axios";
import AuthForm from "./AuthForm";

const API = "http://localhost:3000/api";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "{}")
  );
  const [tasks, setTasks] = useState([]);
  const [taskText, setTaskText] = useState("");
  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  const handleLogout = () => {
    setToken(null);
    setUser({});
    localStorage.clear();
    setTasks([]);
  };

  // Fetch tasks
  useEffect(() => {
    if (!token) return;
    const fetchTasks = async () => {
      try {
        const res = await axios.get(`${API}/tasks`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(res.data);
      } catch {
        setTasks([]);
      }
    };
    fetchTasks();
  }, [token]);

  // Add task
  const addTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API}/tasks`, { text: taskText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTaskText("");
      // Reload tasks
      const res = await axios.get(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch {
      alert("Error adding task");
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API}/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(tasks.filter(t => t._id !== id));
    } catch {
      alert("Error deleting task");
    }
  };

  // Edit task
  const startEdit = (id, text) => {
    setEditId(id);
    setEditText(text);
  };

  const saveEdit = async (id) => {
    try {
      await axios.put(`${API}/tasks/${id}`, { text: editText }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEditId(null);
      setEditText("");
      // Reload tasks
      const res = await axios.get(`${API}/tasks`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTasks(res.data);
    } catch {
      alert("Error updating task");
    }
  };

  if (!token) {
    return <AuthForm setToken={setToken} setUser={setUser} />;
  }

  return (
    <div style={{ maxWidth: 400, margin: "40px auto" }}>
      <h2>Welcome, {user.name}!</h2>
      <button onClick={handleLogout} style={{ marginBottom: 20 }}>Logout</button>
      <form onSubmit={addTask} style={{ marginBottom: 20 }}>
        <input
          value={taskText}
          onChange={e => setTaskText(e.target.value)}
          placeholder="New Task"
          style={{ width: "70%", marginRight: 8 }}
        />
        <button type="submit">Add</button>
      </form>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map(task => (
          <li key={task._id} style={{ marginBottom: 10 }}>
            {editId === task._id ? (
              <>
                <input value={editText} onChange={e => setEditText(e.target.value)} style={{ marginRight: 8 }} />
                <button onClick={() => saveEdit(task._id)}>Save</button>
                <button onClick={() => setEditId(null)} style={{ marginLeft: 4 }}>Cancel</button>
              </>
            ) : (
              <>
                {task.text}
                <button onClick={() => startEdit(task._id, task.text)} style={{ marginLeft: 8 }}>Edit</button>
                <button onClick={() => deleteTask(task._id)} style={{ marginLeft: 4 }}>Delete</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;