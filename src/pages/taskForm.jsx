import React, { useState } from 'react';

function TaskForm({ initialData = { title: '', description: '' }, onSubmit }) {
  const [task, setTask] = useState(initialData);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!task.title.trim()) newErrors.title = 'Title is required';
    if (!task.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (onSubmit) onSubmit(task);
    setSubmitted(true);
    setErrors({});
  };

  return (
    <div className="form-container" style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>{initialData.id ? 'Edit Task' : 'Add Task'}</h2>
      {submitted && <p style={{ color: 'green' }}>Task submitted successfully!</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title:</label>
          <input
            name="title"
            value={task.title}
            onChange={handleChange}
            className={errors.title ? 'input-error' : ''}
          />
          {errors.title && <span className="error">{errors.title}</span>}
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={task.description}
            onChange={handleChange}
            className={errors.description ? 'input-error' : ''}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>
        <button type="submit">{initialData.id ? 'Update' : 'Add'} Task</button>
      </form>
    </div>
  );
}

export default TaskForm;