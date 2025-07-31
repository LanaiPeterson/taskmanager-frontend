import React, { useState, useEffect } from 'react';

// ProjectManager component to handle project creation, deletion, and selection
function ProjectManager({ token, onProjectSelect, selectedProject }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);
// Fetch projects from the API
  const fetchProjects = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };
// Handle project selection
  useEffect(() => {
    fetchProjects();
  }, [token]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    console.log('handleCreateProject called with:', newProject);
    
    if (!newProject.name.trim()) {
      console.log('Project name is empty, returning early');
      return;
    }

    console.log('Sending project data:', newProject);
// Create a new project
    try {
      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newProject)
      });

      console.log('Project creation response:', res.status, res.statusText);
// Check if the response is ok
      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to create project:', error);
        alert(`Failed to create project: ${error.message || 'Unknown error'}`);
        return;
      }

      const createdProject = await res.json();
      console.log('Project created successfully:', createdProject);

      setNewProject({ name: '', description: '' });
      setShowForm(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Error creating project. Please check your connection and try again.');
    }
  };
// Handle deleting a project
  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Delete this project? All associated tasks will be unassigned.')) return;

    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) {
        const error = await res.json();
        console.error('Failed to delete project:', error);
        alert(`Failed to delete project: ${error.message || 'Unknown error'}`);
        return;
      }

      console.log('Project deleted successfully');
      fetchProjects();
      if (selectedProject && selectedProject._id === projectId) {
        onProjectSelect(null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please check your connection and try again.');
    }
  };
// Render the project manager
  return (
    <div className="project-manager">
      <div className="project-header">
        <h3 className="project-title">Projects</h3>
        <button 
          className="new-project-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {showForm && (
        <div className="project-form">
          <form onSubmit={handleCreateProject}>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              required
            />
            <textarea
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
            />
            <button type="submit" className="create-project-btn">
              Create Project
            </button>
          </form>
        </div>
      )}
      <div className="project-filters">
        <button
          className={`filter-btn ${!selectedProject ? 'active' : ''}`}
          onClick={() => onProjectSelect(null)}
        >
          All Tasks
        </button>
        {projects.map(project => (
          <button
            key={project._id}
            className={`filter-btn ${selectedProject?._id === project._id ? 'active' : ''}`}
            onClick={() => onProjectSelect(project)}
          >
            {project.name}
          </button>
        ))}
      </div>

      {projects.length > 0 && (
        <div className="project-management">
          <h4 className="management-title">Manage Projects</h4>
          <div className="project-list">
            {projects.map(project => (
              <div key={project._id} className="project-item">
                <span className="project-name">{project.name}</span>
                <button
                  className="delete-project-btn"
                  onClick={() => handleDeleteProject(project._id)}
                  title="Delete project"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <div className="loading-text">Loading projects...</div>}
    </div>
  );
}

export default ProjectManager;
