# DigitalHub Task Dashboard

A full-stack project management dashboard with real-time task updates.  
Supports Admin, Project Manager, and Developer roles.

---

## Project Overview

This project is a task management dashboard built with:

- **Frontend:** Next.js,  TypeScript, Tailwind CSS, React Hook Form
- **WebSocket:** Real-time updates for tasks
- **Database:** JSON-based local database (`db.json`) for simplicity
- **Authentication:** Email & Password based login
- **Roles:** Admin, Project Manager, Developer

---

## Predefined Users

| Role | Name | Email | Password |
|------|------|-------|----------|
| Admin | Admin User | admin@test.com | 123456 |
| Project Manager | Project Manager | manager@test.com | 123456 |
| Developer | Developer User | dev@test.com | 123456 |

> Make sure to run `generate-db.js` to create the initial database with these users.

---

## Prerequisites

- Node.js v18+  
- npm or yarn  
- Git  

---

## Setup Instructions

### 1️⃣ Clone the repository

```bash
git clone https://github.com/20180360/ProjectDashboard-DigitalHubTask.git
cd ProjectDashboard-DigitalHubTask

### 2️⃣ Install Frontend Dependencies

cd my-project
npm install

### 3️⃣ Generate Database (db.json)

### Run Backend Server

node generate-db      # Generate initial JSON database with default users, projects, and tasks
node server.js             # Start backend server at http://localhost:5000

### 4️⃣ Run Frontend

npm run dev

Frontend will run on http://localhost:3000
Login using one of the predefined users

### 5️⃣ WebSocket (Real-time Updates)

cd websocket-server

node ws-server

WebSocket server running on ws://localhost:3001


### Usage

Open http://localhost:3000/login

Login with one of the predefined users

Access the dashboard:

Admin: Full access

Project Manager: Manage tasks

Developer: View & update assigned tasks


### Project Structure

/my-project
  ├─ app/                  # Next.js pages
  ├─ components/           # Reusable UI components
  ├─ hooks/                # React Query & WebSocket hooks
  ├─ types/                # TypeScript interfaces
  ├─ utils/                # Helper functions
  ├─ db.json               # JSON database
  ├─ generate-db.js        # Script to populate db.json
  └─ package.json

### notes

React Query: Fetch tasks/projects from db.json

Zod + React Hook Form: Form validation

Filters: Project details page allows filtering tasks by status, priority, assigned user

Bulk Update: Update multiple tasks at once

JWT Auth: Frontend simulates login and stores JWT in localStorage
