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
        <div className="empty-state">
          <p>No tasks found. Add a task to get started!</p>
        </div>
      ) : (
        <div>
          {tasks.map((task) => (
            <div key={task._id} className="task-item">
              {editingId === task._id ? (
                <div className="edit-form">
                  <input
                    value={edit.title}
                    onChange={(e) => setEdit((ed) => ({ ...ed, title: e.target.value }))}
                    placeholder="Title"
                  />
                  <input
                    value={edit.details}
                    onChange={(e) => setEdit((ed) => ({ ...ed, details: e.target.value }))}
                    placeholder="Details"
                  />
                  <button className="btn btn-save" onClick={() => handleEditSave(task._id)}>
                    Save
                  </button>
                  <button className="btn btn-cancel" onClick={cancelEdit}>
                    Cancel
                  </button>
                </div>
              ) : (
                <>
                  <div className="task-content">
                    <div className="task-title">{task.title}</div>
                    {task.details && <div className="task-details">{task.details}</div>}
                    {task.project && (
                      <div className="project-badge">
                        📁 {task.project.name}
                      </div>
                    )}
                  </div>
                  <div className="task-actions">
                    <button className="btn btn-edit" onClick={() => startEdit(task)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(task._id)}>
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default TaskList;