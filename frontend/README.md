TeamFlow – Task & Project Management System
============================================


Setup Instructions
------------------
1. Clone Repository
        git clone https://github.com/Rumaisasaleh/teamflow.git
        cd teamflow

2. Install Backend Dependencies
        cd backend
        npm install

3. Configure Backend Environment Variables

        Create /backend/.env file:
        PORT=5000
        JWT_SECRET=your_secret_key

        DB_USER=postgres
        DB_PASSWORD=yourpassword
        DB_HOST=localhost
        DB_PORT=5432
        DB_DATABASE=teamflow

4. Setup PostgreSQL Database

        Install PostgreSQL

        Create a database:
        Create tables:


This project includes:
---------------------
Backend: Node.js + Express + PostgreSQL
Frontend: Next.js
Auth: JWT (Admin + Members)
Kanban: dnd-kit
Database: PostgreSQL

Run Backend
-----------
    cd backend
    npm install
    npm start

    Starts at:
    http://localhost:5000

Run Frontend
------------
    cd frontend
    npm install
    npm run dev

    Starts at:
    http://localhost:3000


Features Completed
-------------------
Authentication:
    Login using email + password
    JSON Web Token–based session

Roles:
    Admin: Manage projects, create tasks, assign tasks
    Members: View and update tasks assigned to them

Projects:
    Create new projects (Admin only)
    View all projects
    Project detail page with Kanban board

Tasks:
    Create tasks under specific projects
    Edit task status
    Drag & drop tasks in Kanban (TODO → IN_PROGRESS → DONE)

Filtering by:
    Status
    Priority
    Assignee
    Keyword search

Kanban Board
    Full drag & drop using dnd-kit


Tech Stack
----------

Frontend
Next.js
React
TailwindCSS
dnd-kit
Backend
Node.js
Express
PostgreSQL
JWT
Bcrypt

Database Setup
--------------

Create PostgreSQL database
    CREATE DATABASE teamflow;

2. Create tables
    CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT,
    role TEXT
    );

    CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT
    );

    CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title TEXT,
    description TEXT,
    status TEXT,
    priority TEXT,
    position INTEGER DEFAULT 0,
    assignee_id INTEGER REFERENCES users(id),
    project_id INTEGER REFERENCES projects(id)
    );


Seed credentials Admin + Members
---------------------------------
    adminPassword = admin@gmail.com  admin123
    member1Password = jane@gmail.com member123
    member2Password = john@gmail.com member123


Environment File (.env.example)

# Backend
        DATABASE_URL=postgresql://postgres:12345@localhost:5433/Teamflow
        JWT_SECRET=supersecret123
        DB_USER=postgres
        DB_HOST=localhost
        DB_NAME=Teamflow
        DB_PASSWORD=12345
        DB_PORT=5433


# Frontend
        NEXT_PUBLIC_API_URL=http://localhost:5000


GitHub Repository
    https://github.com/Rumaisasaleh/teamflow.git







This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# TeamFlow - Frontend

This is the Next.js frontend for the TeamFlow assignment.

**Local assignment PDF (provided by you):** `/mnt/data/task.pdf`

## Setup

1. Install Node.js 18+
2. From this `frontend/` directory:

```bash
npm install
npm run dev
