import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import AuthForm from "./pages/AuthForm";
import TaskList from "./TaskList";
import ProjectManager from "./components/ProjectManager";

const API = "http://localhost:3000/api";

function App() {
  const[user, setUser] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", details: "", project: "" });

  const fetchTasks = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch("/api/tasks", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (e) {
      // handle error
    } finally {
      setLoading(false);
    }
  };

  const fetchProjects = async () => {
    if (!token) return;
    try {
      const res = await fetch("/api/projects", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      // handle error
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    // eslint-disable-next-line
  }, [token]);

  const handleLogin = (jwt) => {
    setToken(jwt);
    localStorage.setItem("token", jwt);
  };

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setNewTask(prev => ({ ...prev, project: project?._id || "" }));
  };

  // Filter tasks based on selected project
  const filteredTasks = selectedProject 
    ? tasks.filter(task => task.project?._id === selectedProject._id)
    : tasks;
// Handle adding a new task

  const handleAddTask = async (e) => {
    e.preventDefault();
    console.log('handleAddTask called with:', { newTask, selectedProject });
    
    if (!newTask.title.trim()) {
      console.log('Task title is empty, returning early');
      return;
    }
    
    const taskData = {
      title: newTask.title,
      details: newTask.details
    };
    
    // Only include project if one is selected
    if (newTask.project) {
      taskData.project = newTask.project;
    }
    
    console.log('Sending task data:', taskData);
    
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(taskData),
      });
      
      console.log('Task creation response:', res.status, res.statusText);
      
      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to create task:', error);
        alert(`Failed to create task: ${error.message || 'Unknown error'}`);
        return;
      }
      
      const createdTask = await res.json();
      console.log('Task created successfully:', createdTask);
      
      setNewTask({ title: "", details: "", project: selectedProject?._id || "" });
      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please check your connection and try again.');
    }
  };

  if (!token) {
    return (
      <div>
        <h1>Task Manager</h1>
        <AuthForm setUser={setUser} setToken={setToken} />
      </div>
    );
  }

  return (
    <div className="app-container">
      <h1>Task Manager</h1>
      <button
        className="logout-btn"
        onClick={() => {
          setToken("");
          localStorage.removeItem("token");
        }}
      >
        Logout
      </button>

      <ProjectManager 
        token={token} 
        onProjectSelect={handleProjectSelect} 
        selectedProject={selectedProject}
      />

      <form onSubmit={handleAddTask}>
        <input
          type="text"
          placeholder="Task title"
          value={newTask.title}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, title: e.target.value }))
          }
          required
        />
        <input
          type="text"
          placeholder="Task details"
          value={newTask.details}
          onChange={(e) =>
            setNewTask((t) => ({ ...t, details: e.target.value }))
          }
        />
        <button type="submit">Add Task</button>
      </form>

      {selectedProject && (
        <div className="project-context">
          <strong>Adding to project:</strong> {selectedProject.name}
          {selectedProject.description && (
            <div className="project-context-description">
              {selectedProject.description}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <TaskList tasks={filteredTasks} token={token} refreshTasks={fetchTasks} />
      )}
    </div>
  );
}

export default App;