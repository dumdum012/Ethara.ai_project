# Team Task Manager

A full-stack, role-based project and task management web application. Built with a focus on high performance and a striking **Brutalist Website Design**.

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based authentication. 
- **Role-Based Access**: 
  - **ADMIN**: Managers who can create, assign, and delete tasks.
  - **MEMBER**: Team members who can view their assigned tasks and update their status.
  - **Role Selection**: Users explicitly choose their role during registration.
- **Task Tracking**: Create, assign, and track the status of tasks (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
- **Strict Permissions**: Only `ADMIN`s can create or delete tasks. Only the specifically assigned `MEMBER` can update a task's status.
- **Time Management**: Task cards automatically calculate and display the remaining time until the due date (e.g., "5 DAYS LEFT" or "DUE TODAY").
- **Brutalist UI**: A beautiful, tasteful brutalist design utilizing bold typography, high-contrast colors, and distinct borders.

## 🛠️ Technology Stack

- **Framework**: [Astro JS](https://astro.build/) (with Server-Side Rendering)
- **Database**: [SQLite](https://www.sqlite.org/) 
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: Vanilla CSS (Brutalist aesthetic)

## 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### 1. Prerequisites
Ensure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### 2. Installation
Clone the repository and install the dependencies:
```bash
npm install
```

### 3. Database Setup
The project uses a local SQLite database (`dev.db`). Generate the Prisma client and apply the database migrations:

```bash
npx prisma generate
npx prisma db push
```

### 4. Start the Development Server
Run the local Astro development server:
```bash
npm run dev
```

The application will be available at: **http://localhost:4321**

### 5. First Steps
1. Navigate to `http://localhost:4321`
2. **Register a new account**. Make sure to select **ADMIN** from the role dropdown to get manager privileges.
3. Once logged in, you can start creating tasks and assigning them.
4. Register a second account and select **MEMBER** to see the team member perspective and perform tasks.

## 🚂 Deployment (Railway)

This application is ready to be deployed on [Railway](https://railway.app/). Since it uses SQLite, you need to configure a persistent volume to ensure your database isn't wiped on every deploy.

### Steps to Deploy:
1. **Push your code to GitHub**: Create a repository and push your local code.
2. **Create a Railway Project**: Go to Railway, click **New Project** -> **Deploy from GitHub repo**, and select your repository.
3. **Add a Persistent Volume**:
   - Go to your newly created service in Railway.
   - Navigate to the **Settings** tab.
   - Scroll down to **Volumes**, click **New Volume**, and set the Mount Path to `/app/data`.
4. **Set Environment Variables**:
   - Go to the **Variables** tab.
   - Add `DATABASE_URL` with the value: `file:/app/data/prod.db`
   - Add `JWT_SECRET` with a secure random string (e.g., `your-super-secret-key`).
5. **Configure Build & Start Commands**:
   - In the **Settings** tab, scroll down to **Build & Start**.
   - Set the **Start Command** to sync the database schema before starting the server:
     ```bash
     npx prisma db push && node ./dist/server/entry.mjs
     ```
6. **Generate Domain**:
   - In the **Settings** tab under **Networking**, click **Generate Domain** to get your public URL.

Wait a few minutes for the build to finish, and your app will be live!
