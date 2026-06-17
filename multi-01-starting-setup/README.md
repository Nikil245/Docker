# Docker Networking + MongoDB + Frontend/Backend

This project builds on the previous Docker sections. Here I learned how to connect a MongoDB container with a Node.js backend using Docker networks, how to persist data using volumes, and how to enable live source code updates with bind mounts for both backend and frontend.

## What I Learned

### Data Persistence

MongoDB data must persist even if the container stops or is removed.

This is achieved by mounting a named volume:

```bash
data:/data/db
```

Volumes ensure that database files are stored outside the container lifecycle.

### Live Source Code Update

Bind mounts connect local project folders directly into the container.

Any changes made to source code locally are reflected instantly inside the container.

This is used for both backend and frontend so development feels seamless.

For backend:

```bash
/app
```

For frontend:

```bash
/app/src
```

### Docker Networks

Containers communicate through a shared custom network:

```bash
goal-network
```

The backend connects to MongoDB using the container name:

```bash
mongodb
```

instead of using `localhost`.

This avoids hardcoding IP addresses and makes multi-container setups clean.

## Updated Dockerfiles

### Backend Dockerfile

```dockerfile
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 80

ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret

CMD ["npm","start"]
```

### Frontend Dockerfile

```dockerfile
FROM node

WORKDIR /app

COPY package.json .

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm","start"]
```

## Project Structure

```text
multi-01-starting-setup/

├── backend/
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json

├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
```

## Prerequisites

Docker
Git

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/multi-01-starting-setup
```

## Build the Images

### Backend Image

```bash
docker build -t goal ./backend
```

### Frontend Image

```bash
docker build -t frontend-goal ./frontend
```

## Run the Containers

### MongoDB Container

```bash
docker run --name mongodb --network goal-network -e MONGO_INITDB_ROOT_USERNAME=root -e MONGO_INITDB_ROOT_PASSWORD=secret -v data:/data/db -d mongo
```

Here MongoDB is started inside the `goal-network` network.

The named volume `data:/data/db` is used so that MongoDB data remains saved even if the container is stopped or removed.

### Backend Container

```bash
docker run --rm --name backend-goal --network goal-network -v logs:/apps/logs -v "your/project/path/multi-01-starting-setup/backend:/app" -v /app/node_modules -p 80:80 -d goal
```

The backend container is also connected to the same `goal-network`.

The bind mount connects the local backend folder to `/app` inside the container, so source code changes are reflected inside the container instantly.

The anonymous volume `/app/node_modules` makes sure the `node_modules` installed inside the container does not get overwritten by the bind mount.

### Frontend Container

```bash
docker run --name goal-frontend -d --rm -it -p 3000:3000 --network goal-network -v "your/project/path/multi-01-starting-setup/frontend/src:/app/src" frontend-goal
```

The frontend container runs on port `3000`.

The bind mount connects the local frontend `src` folder to `/app/src` inside the container. This allows live source code updates while developing the frontend.

Replace `your/project/path` with the actual path where this project is located on your machine.

## Volumes Explained

### MongoDB Named Volume

```bash
-v data:/data/db
```

This stores MongoDB database files outside the container lifecycle. Even if the MongoDB container is removed, the database data remains safe in the named volume.

### Backend Logs Volume

```bash
-v logs:/apps/logs
```

This stores backend logs in a Docker-managed named volume.

### Backend Bind Mount

```bash
-v "your/project/path/multi-01-starting-setup/backend:/app"
```

This connects the local backend folder directly to `/app` inside the container. Any local code changes are reflected inside the container.

### Backend Anonymous Volume

```bash
-v /app/node_modules
```

This protects the container’s `node_modules` folder from being overwritten by the backend bind mount.

### Frontend Bind Mount

```bash
-v "your/project/path/multi-01-starting-setup/frontend/src:/app/src"
```

This connects the local frontend `src` folder directly to `/app/src` inside the container so frontend code updates are reflected instantly.

## Open the App

Backend API:

```text
http://localhost:80
```

Frontend React App:

```text
http://localhost:3000
```

## Useful Commands

Check running containers:

```bash
docker ps
```

Stop a container:

```bash
docker stop backend-goal
```

List volumes:

```bash
docker volume ls
```

Remove a volume:

```bash
docker volume rm data
```

Remove images:

```bash
docker rmi goal frontend-goal mongo
```

## Note

The bind mount paths in the run commands are specific to your machine. Adjust them to match your local project folder.

MongoDB root user is created in the `admin` database, so the backend connection string must include:

```text
?authSource=admin
```

This section taught me how to ensure data must persist using volumes and how to enable live source code update using bind mounts.
