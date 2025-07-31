import React, { useState, useEffect } from 'react';

function ProjectManager({ token, onProjectSelect, selectedProject }) {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ marginBottom: 24, padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ margin: 0 }}>Projects</h3>
        <button 
          onClick={() => setShowForm(!showForm)}
          style={{ 
            backgroundColor: '#007bff', 
            color: 'white', 
            border: 'none', 
            padding: '6px 12px', 
            borderRadius: 4,
            cursor: 'pointer' 
          }}
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreateProject} style={{ marginBottom: 16 }}>
          <div style={{ marginBottom: 8 }}>
            <input
              type="text"
              placeholder="Project name"
              value={newProject.name}
              onChange={(e) => setNewProject(prev => ({ ...prev, name: e.target.value }))}
              required
              style={{ width: '100%', padding: '8px 12px', marginBottom: 8, borderRadius: 4, border: '1px solid #ddd' }}
            />
            <textarea
              placeholder="Project description"
              value={newProject.description}
              onChange={(e) => setNewProject(prev => ({ ...prev, description: e.target.value }))}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 4, border: '1px solid #ddd', minHeight: 60 }}
            />
          </div>
          <button type="submit" style={{ backgroundColor: '#28a745', color: 'white', border: 'none', padding: '6px 12px', borderRadius: 4 }}>
            Create Project
          </button>
        </form>
      )}

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => onProjectSelect(null)}
          style={{
            padding: '6px 12px',
            borderRadius: 4,
            border: '1px solid #ddd',
            backgroundColor: !selectedProject ? '#007bff' : 'white',
            color: !selectedProject ? 'white' : '#007bff',
            cursor: 'pointer'
          }}
        >
          All Tasks
        </button>
        {projects.map(project => (
          <button
            key={project._id}
            onClick={() => onProjectSelect(project)}
            style={{
              padding: '6px 12px',
              borderRadius: 4,
              border: '1px solid #ddd',
              backgroundColor: selectedProject?._id === project._id ? '#007bff' : 'white',
              color: selectedProject?._id === project._id ? 'white' : '#007bff',
              cursor: 'pointer'
            }}
          >
            {project.name}
          </button>
        ))}
      </div>

      {projects.length > 0 && (
        <div>
          <h4 style={{ fontSize: 14, margin: '8px 0 4px 0', color: '#666' }}>Manage Projects:</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {projects.map(project => (
              <div key={project._id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <span style={{ fontSize: 12, color: '#666' }}>{project.name}</span>
                <button
                  onClick={() => handleDeleteProject(project._id)}
                  style={{
                    backgroundColor: '#dc3545',
                    color: 'white',
                    border: 'none',
                    padding: '2px 6px',
                    borderRadius: 3,
                    fontSize: 10,
                    cursor: 'pointer'
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {loading && <p style={{ fontSize: 12, color: '#666' }}>Loading projects...</p>}
    </div>
  );
}

export default ProjectManager;
