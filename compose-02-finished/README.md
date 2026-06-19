# Docker Compose — Multi-Container Goal App

This project builds on the previous data volumes and environment variables
project. Here I learned how to use **Docker Compose** to define and run
multiple containers together using a single `docker-compose.yaml` file
instead of writing long `docker run` commands every time.

## What I Learned

### Docker Compose
When you have multiple containers that need to work together, running and
managing them manually with `docker run` gets messy fast. Docker Compose
solves this by letting you define all your containers, volumes, networks,
and environment variables in one `docker-compose.yaml` file.

Instead of typing out a long command with all the flags every single time,
you just run:

```bash
docker compose up
```

And Docker takes care of building the images, creating the containers,
setting up the networks, and mounting the volumes — all in one go.

### docker-compose.yaml
The `docker-compose.yaml` file is where you define everything about your
application. In this project it defines **3 services** that all work together:

**mongodb** — pulls the official MongoDB image from Docker Hub and stores
goal data in a named volume so it is not lost when the container stops.
It reads the MongoDB username and password from `./env/mongo.env`.

**backend** — builds the Node.js Express API from the backend Dockerfile.
It connects to MongoDB, handles all the goal logic (fetch, save, delete),
and exposes port 80. It depends on the mongodb service so Docker starts
MongoDB first before starting the backend.

**frontend** — builds the React app from the frontend Dockerfile and serves
it on port 3000. It depends on the backend service. The `stdin_open` and
`tty` flags are set to true so the React dev server stays alive inside
the container.

### depends_on
The `depends_on` key in the compose file tells Docker the order to start
the services in. The backend waits for mongodb to be ready and the frontend
waits for the backend. This makes sure the containers come up in the right
order without you having to manage that manually.

### Commands

**Start the application:**
```bash
docker compose up
```
This builds the images (if they do not exist yet) and starts all 3
containers. Add `-d` to run everything in the background:
```bash
docker compose up -d
```

**Stop and remove the containers:**
```bash
docker compose down
```
This stops all running containers and removes them along with the default
network Docker Compose creates. Your named volumes are kept so your data
is safe. If you also want to delete the volumes run:
```bash
docker compose down -v
```

## About the App

This is a **Goal Tracker** app made up of 3 containers working together:

- **MongoDB** — stores all the goals in a database
- **Backend** — a Node.js and Express REST API that connects to MongoDB
  and handles creating, fetching, and deleting goals
- **Frontend** — a React app where users can type in a goal, submit it,
  see all their saved goals on screen, and delete any goal they want

The frontend talks to the backend API and the backend saves and retrieves
goals from MongoDB.

## Project Structure
compose-02-finished/

├── backend/

│   ├── logs/

│   ├── models/

│   │   └── goal.js

│   ├── app.js

│   ├── Dockerfile

│   └── package.json

├── frontend/

│   ├── src/

│   ├── Dockerfile

│   └── package.json

├── env/

│   ├── mongo.env

│   └── backend.env

└── docker-compose.yaml

## Prerequisites

- Docker
- Git

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/compose-02-finished
```

## Environment Files

Before running, make sure the `env/` folder has these two files:

`env/mongo.env`:
MONGO_INITDB_ROOT_USERNAME=root

MONGO_INITDB_ROOT_PASSWORD=secret

`env/backend.env`:
MONGODB_USERNAME=root

MONGODB_PASSWORD=secret

These files are not pushed to GitHub since they contain sensitive credentials.

## Run with Docker Compose

```bash
docker compose up
```

Open the app at: **http://localhost:3000**

The backend API runs at: **http://localhost:80**

## Stop the App

```bash
docker compose down
```

## Useful Commands

Check running containers:
```bash
docker ps
```

View logs from all services:
```bash
docker compose logs
```

View logs from a specific service:
```bash
docker compose logs backend
```

Rebuild images and start fresh:
```bash
docker compose up --build
```

List all volumes:
```bash
docker volume ls
```

## Note

The `env/` files are not pushed to GitHub intentionally since they contain
credentials. Create them manually before running `docker compose up`.
