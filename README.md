# Task Manager App

A full-stack Task Manager web application built with a modern frontend (React + Vite) and a RESTful Express.js backend. Users can register, log in, create and manage projects, and add tasks within those projects. The app features JWT authentication, protected routes, and an intuitive user interface.

## Features

- **User Authentication:** Register and log in securely using JWT tokens.
- **Project Management:** Create, update, and delete projects.
- **Task Management:** Add, edit, complete, and remove tasks within projects.
- **Authorization:** Only project owners (or authorized users) can manage their projects and tasks.
- **Responsive UI:** Clean, modern design using React and CSS.

## Tech Stack

- **Frontend:** React, Vite, Fetch API, CSS
- **Backend:** Node.js, Express.js, MongoDB (with Mongoose)
- **Authentication:** JWT (JSON Web Tokens), bcrypt for password hashing

## Usage

1. Register a new user account.
2. Log in to access the dashboard.
3. Create a new project.
4. Add tasks to your project.
5. Mark tasks as complete, edit, or delete them.
6. Log out when done.

## API Endpoints

- `POST /api/auth/register` — Register a new user
- `POST /api/auth/login` — Login and get JWT token
- `GET /api/projects` — List user’s projects
- `POST /api/projects` — Create a project
- `POST /api/tasks` — Create a task (must include `projectId`)
- `GET /api/tasks?projectId=...` — List tasks for a project

## Acknowledgments

- Inspired by modern productivity apps
- Built with 💙 using the MERN stack
- RTT-2025-23
- Special thanks to the mentors and glassmates who have helped me with issues when completing this project.

## Challenges

The biggest challenge was implenting everything that I have learned over the last 17 weeks and putting it all togther in a responsive project. I had to go back serveral times to previous modles and assignemnts to piece it all together. The backend was very challenging, making sure that it was responsive and operable. Implementing the frotend was easy once I figured out why it was not responding to the backend.
