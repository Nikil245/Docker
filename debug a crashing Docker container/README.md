# Docker Debugging Lab – Crashed Full-Stack Notes Application

A hands-on Docker debugging project designed to simulate real-world container failures.

This project contains a complete Notes application consisting of:

Frontend: HTML + Nginx
Backend: Node.js + Express
Database: MongoDB

The application is intentionally broken. Your goal is to investigate why the containers crash and recover the entire application using Docker debugging techniques.

---

# Project Structure

```text
.
├── frontend/
│   ├── index.html
│   └── nginx.conf
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── Dockerfile
│
├── docker-compose.yml
└── README.md
```

---

# Getting Started

## 1️Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
```

Navigate into the project folder:

```bash
cd <YOUR_PROJECT_FOLDER>
```

---

# Start the Application

Build the Docker images and start all services:

```bash
docker compose up -d --build
```

> Note
>
> The containers are intentionally configured to crash during startup.
>
> The `docker compose up` command may appear successful, but one or more containers will immediately exit.
>
> Your task is to identify the root cause and fix the application.

---

# Docker Debugging Workflow

## Step 1 — Find the Crashed Containers

List all containers, including stopped ones:

```bash
docker ps -a
```

Look for containers showing:

```text
Exited (1)
Exited (255)
Exited (...)
```

---

## Step 2 — Read the Container Logs

Inspect the logs to determine why the container exited.

```bash
docker logs <container_name_or_id>
```

Example:

```bash
docker logs notes-backend
```

---

## Step 3 — Check for OOM (Out Of Memory)

If there are no useful logs, verify whether Docker killed the container because of insufficient memory.

```bash
docker inspect <container_name_or_id> | grep -i oom
```

If you see:

```text
OOMKilled: true
```

the container was terminated due to memory exhaustion.

---

# Recovery Guide

After identifying the errors, apply the following fixes.

---

# Fix 1 — Frontend Crash

**File**

```text
frontend/nginx.conf
```

### Problem

Nginx contains a syntax error.

### Fix

Add the missing semicolon after the `listen` directive.

```nginx
server {

    listen 80;

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

}
```

---

# Fix 2 — Backend Crash

**File**

```text
backend/server.js
```

### Problem

The backend requires an environment variable that doesn't exist.

Locate the sabotage block:

```javascript
if (!process.env.SUPER_SECRET_KEY) {
    throw new Error(
        "CRITICAL FAILURE: System cannot boot. SUPER_SECRET_KEY is missing!"
    );
}
```

### Option 1 (Recommended)

Delete or comment out the block.

```javascript
// if (!process.env.SUPER_SECRET_KEY) {
//     throw new Error("CRITICAL FAILURE: System cannot boot.");
// }
```

### Option 2

Provide the environment variable inside:

```yaml
docker-compose.yml
```

---

# Rebuild the Project

After saving all changes, remove the old containers:

```bash
docker compose down
```

Rebuild everything:

```bash
docker compose up -d --build
```

---

# Verify Everything Works

Check that all containers are running:

```bash
docker ps
```

Expected output:

```text
CONTAINER ID   IMAGE              STATUS
xxxxxxxxxxxx   notes-frontend     Up
xxxxxxxxxxxx   notes-backend      Up
xxxxxxxxxxxx   mongo              Up
```

No containers should show an **Exited** status.

---

# Docker Commands Reference

| Purpose                    | Command                        |
| -------------------------- | ------------------------------ |
| Build and start containers | `docker compose up -d --build` |
| Stop containers            | `docker compose down`          |
| View running containers    | `docker ps`                    |
| View all containers        | `docker ps -a`                 |
| View container logs        | `docker logs <container>`      |
| Inspect container          | `docker inspect <container>`   |
| Restart services           | `docker compose restart`       |
| Remove unused resources    | `docker system prune`          |

---

# Learning Objectives

By completing this lab, you will learn how to:

* Debug crashed Docker containers
* Read Docker logs effectively
* Interpret container exit codes
* Identify configuration errors
* Debug Nginx startup failures
* Debug Node.js runtime failures
* Rebuild Docker images correctly
* Restore a broken multi-container application

---


