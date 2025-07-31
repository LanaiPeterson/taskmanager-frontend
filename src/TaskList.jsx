import React, { useState } from "react";

function TaskList({ tasks, token, refreshTasks }) {
  const [editingId, setEditingId] = useState(null);
  const [edit, setEdit] = useState({ title: "", details: "" });

  // Delete a task
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this task?")) return;
    
    try {
      const res = await fetch(`/api/tasks/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete task:', error);
        alert(`Failed to delete task: ${error.message || 'Unknown error'}`);
        return;
      }
      
      console.log('Task deleted successfully');
      refreshTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Please check your connection and try again.');
    }
  };

  // Start editing
  const startEdit = (task) => {
    setEditingId(task._id);
    setEdit({ title: task.title, details: task.details || "" });
  };

  // Save edit
  const handleEditSave = async (id) => {
    await fetch(`/api/tasks/${id}`, {
      method: "PUT",
      headers: { 
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(edit),
    });
    setEditingId(null);
    setEdit({ title: "", details: "" });
    refreshTasks();
  };

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null);
    setEdit({ title: "", details: "" });
  };

  return (
    <div>
      {tasks.length === 0 ? (
        <p style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', marginTop: 32 }}>
          No tasks found. Add a task to get started!
        </p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {tasks.map((task) => (
            <li key={task._id} style={{ marginBottom: 16, borderBottom: "1px solid #ddd", paddingBottom: 8 }}>
              {editingId === task._id ? (
                <>
                  <input
                    value={edit.title}
                    onChange={(e) => setEdit((ed) => ({ ...ed, title: e.target.value }))}
                    placeholder="Title"
                    style={{ marginRight: 8 }}
                  />
                  <input
                    value={edit.details}
                    onChange={(e) => setEdit((ed) => ({ ...ed, details: e.target.value }))}
                    placeholder="Details"
                    style={{ marginRight: 8 }}
                  />
                  <button onClick={() => handleEditSave(task._id)}>Save</button>
                  <button onClick={cancelEdit} style={{ marginLeft: 4 }}>Cancel</button>
                </>
              ) : (
                <>
                  <div>
                    <b>{task.title}</b>
                    {task.details && <> - {task.details}</>}
                    {task.project && (
                      <div style={{ 
                        fontSize: 12, 
                        color: '#666', 
                        marginTop: 4,
                        backgroundColor: '#f0f8ff',
                        padding: '2px 6px',
                        borderRadius: 3,
                        display: 'inline-block'
                      }}>
                        📁 {task.project.name}
                      </div>
                    )}
                  </div>
                  <div style={{ marginTop: 8 }}>
                    <button onClick={() => startEdit(task)} style={{ marginLeft: 8 }}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(task._id)} style={{ marginLeft: 4, color: "red" }}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskList;