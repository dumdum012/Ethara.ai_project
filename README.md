# Team Task Manager

A full-stack, role-based project and task management web application. Built with a focus on high performance and a striking **Brutalist Website Design**.

## ✨ Features

- **Authentication & Authorization**: Secure JWT-based authentication. 
- **Role-Based Access**: 
  - **ADMIN**: The first user to register automatically becomes an Admin. Admins can create projects and assign members.
  - **MEMBER**: Subsequent users are Members. They can view projects they are assigned to and manage their tasks.
- **Project Management**: Group tasks into specific projects.
- **Task Tracking**: Create, assign, and track the status of tasks (`PENDING`, `IN_PROGRESS`, `COMPLETED`).
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
npx prisma migrate dev
```
*Note: If you are prompted for a migration name during `migrate dev`, you can name it `init`.*

### 4. Start the Development Server
Run the local Astro development server:
```bash
npm run dev
```

The application will be available at: **http://localhost:4321**

### 5. First Steps
1. Navigate to `http://localhost:4321`
2. **Register a new account**. Since this is the first account, it will automatically be granted **ADMIN** privileges.
3. Once logged in, click **MANAGE_PROJECTS** to create your first project.
4. Register a second account in another browser window to see the **MEMBER** perspective.

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
   - Set the **Start Command** to run database migrations before starting the server:
     ```bash
     npx prisma db push && node ./dist/server/entry.mjs
     ```
     *(Note: `db push` is used here instead of `migrate deploy` for simplicity with SQLite, but both work).*
6. **Generate Domain**:
   - In the **Settings** tab under **Networking**, click **Generate Domain** to get your public URL.

Wait a few minutes for the build to finish, and your app will be live!
