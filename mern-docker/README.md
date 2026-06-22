# What I Learned — Dockerizing a MERN Stack App + How Nginx Works as a Reverse Proxy

This project is a hands-on practice of running a full MERN stack application using Docker. Instead of installing Node, MongoDB, or Nginx directly on your machine, everything runs inside Docker containers. The app itself is a simple Todo App where you can add, complete, and delete todos. But the real learning here is how the containers are set up, connected, and managed using Docker and Docker Compose and how Nginx sits in the middle of everything.

---

## What I Learned

- How to write a Dockerfile for a Node/Express backend
- How to write a multi-stage Dockerfile for React (build with Node, serve with Nginx)
- How to use docker-compose.yaml to wire multiple containers together
- How containers talk to each other using service names (not localhost)
- How Nginx works as a reverse proxy (forwards /api/* to Express)
- How to use named volumes so MongoDB data survives container restarts
- How port mapping works (HOST:CONTAINER)
- How to fix common errors like port conflicts, build context issues, and MongoDB connection failures

---

## What is Nginx and Why is it Even Here?

When I first saw Nginx in this project, I thought why do we even need this, can't React just talk to Express directly? Turns out no. And once I understood why, everything clicked.

Nginx sits in front of everything. Your browser never directly talks to Express or React's dev server. Every single request whether it's loading the page or fetching todos goes through Nginx first. Think of it like a reception desk. You don't walk straight into the office, you go through reception and they send you to the right place.

In this project Nginx has exactly two jobs.

### Job 1 — Showing you the React app

When you run `npm run build`, React doesn't need Node anymore. It just becomes plain old HTML, CSS and JS files sitting in a `/dist` folder. Nginx is really good at serving files like this, way better and lighter than running a whole Node server just to send an HTML file. So we copy that `/dist` folder into the Nginx container and it serves it directly to your browser.
You open localhost:8000

↓

Nginx looks inside /usr/share/nginx/html

↓

Sends back index.html → your React app loads

### Job 2 — Sending API calls to Express

When your React app does something like `fetch('/api/todos')`, that request also goes to Nginx first. Nginx looks at the URL, sees it starts with `/api/` and says okay this isn't a file, this goes to the backend. It then forwards that request to the Express container running on port 5000. Express handles it, talks to MongoDB, and sends the response back through Nginx to your browser.
React calls /api/todos

↓

Nginx sees /api/ → forwards to Express (port 5000)

↓

Express talks to MongoDB, gets the todos

↓

Response comes back through Nginx to your browser

Your browser never even knows Express exists. It only ever talks to Nginx. This is called a reverse proxy and this is how literally every real production app works.

---

## The nginx.conf — What Each Line Actually Does

```nginx
server {
    listen 80;
    # Nginx is listening on port 80 inside the container
    # docker-compose maps your machine's 8000 → this 80

    location / {
        # any normal request like / or /about goes here
        root /usr/share/nginx/html;
        # look for files in this folder (our React build lives here)

        index index.html;

        try_files $uri $uri/ /index.html;
        # this line is important — explained below
    }

    location /api/ {
        # any request starting with /api/ comes here instead
        proxy_pass http://backend:5000;
        # forward it to the Express container
        # "backend" is the service name from docker-compose.yaml
        # Docker automatically knows which container "backend" means

        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        # these lines just make sure the request is forwarded cleanly
    }
}
```

### Why `try_files $uri $uri/ /index.html` saved my life

This one line fixed a bug I was getting where the page was crashing on refresh. React is a Single Page App. There's only one actual HTML file which is `index.html`. React fakes all the other routes like `/todos` or `/about` using JavaScript in the browser. But when you refresh on `/todos`, Nginx tries to find an actual file called todos in the folder. It doesn't exist. So without this line you get a 404 error and the page crashes.

With this line Nginx says can't find the file, no problem, just serve `index.html` and let React figure out the routing. And that's exactly what React needs.

### Why `proxy_pass http://backend:5000` works without an IP address

Inside Docker every container is like its own little computer on a private network. They don't use localhost to talk to each other because localhost inside the Nginx container means the Nginx container itself, not Express. Docker gives every service a name, whatever you wrote in `docker-compose.yaml`. So `backend` just resolves to the Express container automatically. Docker handles all the networking behind the scenes and you never need to know the actual IP.

---

## The Multi-Stage Dockerfile — Why Two Stages?

```dockerfile
# Stage 1 — Node does the building
FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
# at this point /app/dist has all our built React files

# Stage 2 — Nginx does the serving
FROM nginx:stable-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# grab the /dist from Stage 1 and put it where Nginx can serve it
COPY nginx.conf /etc/nginx/conf.d/default.conf
# use our custom nginx config instead of the default one
```

Why not just do it in one stage? Because Node is heavy, around 350MB just to build. But once the build is done we don't need Node at all. Nginx is tiny, around 25MB, and that's all we need to actually serve the files. Multi-stage build lets us use Node to build, then throw it away and only keep the output. The final Docker image is just Nginx plus the built files. Much smaller, much faster.

---

## Project Structure
mern-docker/

├── docker-compose.yaml       ← wires all 3 containers together

├── nginx/

│   └── nginx.conf            ← serves React + proxies /api to Express

├── frontend/

│   ├── Dockerfile            ← multi-stage: builds React, then serves via Nginx

│   ├── nginx.conf            ← copied into build context for the Dockerfile

│   ├── index.html

│   ├── vite.config.js

│   ├── package.json

│   └── src/

│       ├── main.jsx

│       └── App.jsx           ← Todo UI (add, complete, delete)

└── backend/

├── Dockerfile            ← runs Express on Node 18

├── server.js             ← API routes: GET/POST/PATCH/DELETE /api/todos

└── package.json

---

## Services

| Container | What it does | Port |
|---|---|---|
| frontend | Nginx — serves React build + proxies /api to backend | 8000 → 80 |
| backend | Express REST API — connects to MongoDB | internal 5000 |
| mongo | MongoDB database — data stored in named volume | 27018 → 27017 |

MongoDB is mapped to 27018 on the host instead of 27017 to avoid conflicts if you have MongoDB installed locally.

---

## How Requests Flow
Browser → localhost:8000

↓

Nginx (port 80)

↓

/          →  React (built static files)

/api/*     →  Express backend (port 5000)

↓

MongoDB (port 27017 inside Docker)

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

---

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/compose-02-finished
```

---

## Docker Commands

### Start the project

Build images and start all containers:

```bash
docker-compose up --build
```

Start without rebuilding if nothing changed:

```bash
docker-compose up
```

### Stop the project

Stop all containers but keep the data:

```bash
docker-compose down
```

Stop all containers and delete all data including the MongoDB volume:

```bash
docker-compose down -v
```

### Debugging

See live logs of all containers:
```bash
docker-compose logs -f
```

See logs of one specific container:
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongo
```

Check which containers are running:
```bash
docker-compose ps
```

Open a shell inside a running container:
```bash
docker exec -it mern-docker-backend-1 sh
docker exec -it mern-docker-mongo-1 sh
```

### Clean Up

Remove stopped containers:
```bash
docker container prune
```

Remove unused images:
```bash
docker image prune
```

Remove everything including containers, images, volumes and networks:
```bash
docker system prune -a --volumes
```

---

## Connecting MongoDB Compass

Since local MongoDB runs on 27017, the Docker MongoDB is mapped to 27018 to avoid conflicts.

Connection string:
mongodb://localhost:27018

Database: `mernapp`

Collection: `todos`

Compass does not auto refresh so press `Ctrl + R` or click the refresh button to see new documents.