# 📝 Docker Notes App — Practice Project

A full-stack Notes app built with **React-free HTML frontend**, **Node.js/Express backend**, and **MongoDB** — all containerized with Docker.

---

## 📁 Project Structure

```
docker-practice/
├── frontend/
│   ├── index.html          # The UI (served by nginx)
│   ├── nginx.conf          # nginx config
│   └── Dockerfile          # Frontend image
├── backend/
│   ├── server.js           # Express API
│   ├── package.json
│   └── Dockerfile          # Backend image
├── docker-compose.yaml     # Orchestrates all 3 containers
├── .env                    # Environment variables
└── README.md
```

---

## 🚀 Quick Start

```bash
# 1. Start everything (builds images + starts containers)
docker compose up --build

# 2. Open browser
# Frontend:  http://localhost:3000
# Backend:   http://localhost:5000/api/health

# 3. Stop everything
docker compose down
```

---

## 🐳 DOCKER COMMANDS TO PRACTICE

### ─── IMAGES ───────────────────────────────────────────

```bash
# List all images
docker images

# Build backend image manually (without compose)
docker build -t notes-backend ./backend

# Build frontend image manually
docker build -t notes-frontend ./frontend

# Remove an image
docker rmi notes-backend

# Pull an image from Docker Hub
docker pull mongo:6

# Inspect an image (layers, ENV, CMD, etc.)
docker inspect notes-backend

# See image history (layers)
docker history notes-backend
```

---

### ─── CONTAINERS ────────────────────────────────────────

```bash
# List running containers
docker ps

# List ALL containers (including stopped)
docker ps -a

# Run backend container manually
docker run -d \
  --name my-backend \
  -p 5000:5000 \
  -e PORT=5000 \
  -e MONGO_URL=mongodb://admin:secret123@mongodb:27017/notesdb?authSource=admin \
  notes-backend

# Stop a container
docker stop notes-backend

# Start a stopped container
docker start notes-backend

# Restart a container
docker restart notes-backend

# Remove a container
docker rm notes-backend

# Force remove (even if running)
docker rm -f notes-backend

# See container logs
docker logs notes-backend

# Follow logs in real-time
docker logs -f notes-backend

# Execute a command inside a running container
docker exec -it notes-backend sh

# Execute inside MongoDB container
docker exec -it notes-mongodb mongosh -u admin -p secret123

# Copy a file from container to host
docker cp notes-backend:/app/server.js ./server-copy.js
```

---

### ─── VOLUMES ────────────────────────────────────────────

```bash
# List all volumes
docker volume ls

# Inspect the named volume (where mongo data lives)
docker volume inspect docker-practice_mongo-data

# Create a volume manually
docker volume create my-test-volume

# Remove a volume
docker volume rm my-test-volume

# Remove ALL unused volumes (careful!)
docker volume prune

# Run with a named volume (manual)
docker run -d \
  --name test-mongo \
  -v my-mongo-data:/data/db \
  mongo:6

# Run with a bind mount (manual)
docker run -d \
  --name test-backend \
  -v $(pwd)/backend:/app \
  -v /app/node_modules \
  notes-backend

# Anonymous volume example (node_modules protection)
# In docker-compose.yaml:
#   volumes:
#     - ./backend:/app         ← Bind mount
#     - /app/node_modules      ← Anonymous volume (protects container's node_modules)
```

---

### ─── NETWORKS ───────────────────────────────────────────

```bash
# List all networks
docker network ls

# Inspect the custom network created by compose
docker network inspect docker-practice_notes-network

# Create a network manually
docker network create my-network

# Run a container on a specific network
docker run -d --name c1 --network my-network nginx
docker run -d --name c2 --network my-network nginx

# From c2, ping c1 by container name (DNS works on custom networks!)
docker exec -it c2 ping c1

# Connect a running container to a network
docker network connect my-network notes-backend

# Disconnect from a network
docker network disconnect my-network notes-backend

# Remove a network
docker network rm my-network
```

---

### ─── ENV VARIABLES ──────────────────────────────────────

```bash
# Pass ENV at runtime
docker run -d \
  -e PORT=5000 \
  -e MONGO_URL=mongodb://admin:secret123@mongodb:27017/notesdb \
  notes-backend

# Pass ENV from a file
docker run -d --env-file .env notes-backend

# View ENV inside a container
docker exec notes-backend env

# In docker-compose.yaml, ENV can be:
# 1. Hardcoded:      PORT: 5000
# 2. From .env file: PORT: ${BACKEND_PORT}
# 3. From shell:     PORT: $BACKEND_PORT
```

---

### ─── DOCKER COMPOSE ─────────────────────────────────────

```bash
# Start all services (detached)
docker compose up -d

# Start + rebuild images
docker compose up -d --build

# Stop all services (containers stay)
docker compose stop

# Stop + remove containers
docker compose down

# Stop + remove containers + volumes (⚠️ deletes mongo data!)
docker compose down -v

# View logs of all services
docker compose logs

# Follow logs of one service
docker compose logs -f backend

# Scale a service (run multiple instances)
docker compose up -d --scale backend=3

# List services
docker compose ps

# Run a one-off command in a service
docker compose exec backend sh
docker compose exec mongodb mongosh -u admin -p secret123

# Restart one service
docker compose restart backend

# Build only (don't start)
docker compose build

# Pull latest images
docker compose pull
```

---

### ─── CLEANUP ────────────────────────────────────────────

```bash
# Remove stopped containers
docker container prune

# Remove unused images
docker image prune

# Remove unused volumes
docker volume prune

# Remove unused networks
docker network prune

# ☢️ Remove EVERYTHING unused (containers, images, volumes, networks)
docker system prune -a --volumes
```

---

## 🔬 Practice Exercises

### Exercise 1 — Images
1. Build the backend image manually: `docker build -t notes-backend ./backend`
2. List images: `docker images`
3. Inspect it: `docker inspect notes-backend`

### Exercise 2 — Containers
1. Start with compose: `docker compose up -d`
2. Check running containers: `docker ps`
3. Open a shell inside backend: `docker exec -it notes-backend sh`
4. Check logs: `docker logs -f notes-backend`

### Exercise 3 — Volumes
1. Add some notes via `http://localhost:3000`
2. Stop + remove containers: `docker compose down`
3. Restart: `docker compose up -d`
4. ✅ Notes still there! (Named volume persisted data)
5. Now try: `docker compose down -v` and restart — notes are gone!

### Exercise 4 — Networks
1. Inspect the network: `docker network inspect docker-practice_notes-network`
2. See all 3 containers on the same network
3. From backend container, ping mongo: `docker exec -it notes-backend ping mongodb`

### Exercise 5 — ENV Variables
1. Open `.env` — change `BACKEND_PORT=5001`
2. Run `docker compose up -d --build`
3. Backend now runs on port 5001

### Exercise 6 — Bind Mount (live dev)
1. With compose running, edit `./backend/server.js`
2. Add a new route (bind mount syncs it instantly)
3. Restart backend only: `docker compose restart backend`

---

## 🏗 What Each Concept Does in This App

| Concept | Where Used |
|---|---|
| **Images** | mongo:6 (pulled), notes-backend (built), notes-frontend (built) |
| **Containers** | notes-mongodb, notes-backend, notes-frontend |
| **Named Volume** | `mongo-data:/data/db` — persists MongoDB data |
| **Anonymous Volume** | `/app/node_modules` — protects backend deps |
| **Bind Mount** | `./backend:/app` — live code sync in dev |
| **Custom Network** | `notes-network` — all 3 containers communicate |
| **ENV Variables** | MONGO_URL, PORT, MONGO credentials from `.env` |
| **docker-compose** | All 3 services in one `docker-compose.yaml` |
| **depends_on** | Backend waits for MongoDB healthcheck |
| **healthcheck** | MongoDB pings itself before backend connects |
