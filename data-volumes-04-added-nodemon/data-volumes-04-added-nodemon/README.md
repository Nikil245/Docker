# Docker Bind Mounts + Nodemon

This project builds on the previous volumes project. The main things added here are bind mounts for live code syncing and nodemon so you can see your changes reflect instantly without rebuilding the image every time.

---

## What I Learned

### Bind Mounts

A regular volume lets Docker save data somewhere on your machine but you don't control where. A bind mount is different — you point Docker to a specific folder on your machine and connect it directly to a folder inside the container. So whatever you change in that folder on your machine, the container sees it immediately.

This is really useful during development because normally if you change something in your code you would have to stop the container, rebuild the image and run it again. With a bind mount that whole process is gone.

### Nodemon

Nodemon is a tool that watches your files and automatically restarts the Node server whenever it detects a change. Combined with a bind mount, the moment you save a file on your machine nodemon picks it up inside the container and restarts the server automatically. You can watch this happen live using `docker logs`.

---

## What Changed

In `server.js` nodemon was added as a dependency so the server watches for file changes and restarts itself automatically instead of you having to do it manually.

The Dockerfile was also updated to use nodemon as the start command instead of plain node.

---

## Project Structure
data-volumes-04-added-nodemon/

├── pages/

├── public/

├── Dockerfile

├── package.json

└── server.js

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

---

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/data-volumes-04-added-nodemon/data-volumes-04-added-nodemon
```

---

## Build the Image

```bash
docker build -t feedback-app:2.0 .
```

---

## Run the Container

```bash
docker run -p 3000:80 -d --rm --name feedb -v feedback:/app/feedback -v "/home/nikil/Documents/Docker-docs/data-volumes-04-added-nodemon:/app" -v /app/node_modules feedback-app:2.0
```

Here is what every part of this command does:

`-p 3000:80` — maps port 3000 on your machine to port 80 inside the container. Open the app at `http://localhost:3000`

`-d` — runs the container in the background so your terminal stays free

`--rm` — automatically deletes the container when it stops so you don't end up with a pile of stopped containers. Your volume data is still safe even when the container is deleted

`--name feedb` — gives the container the name `feedb` instead of a random one. Change this to whatever name you want

`-v feedback:/app/feedback` — this is the named volume. Anything saved in `/app/feedback` inside the container gets stored in the `feedback` volume on your machine and survives even after the container stops

`-v "/home/nikil/Documents/Docker-docs/data-volumes-04-added-nodemon:/app"` — this is the bind mount. It connects your local project folder directly to `/app` inside the container. So any file you edit on your machine shows up inside the container instantly

`-v /app/node_modules` — this tells Docker to keep the `node_modules` folder that was installed inside the container and not let the bind mount overwrite it with your local machine's version. Without this the container would look for node_modules in your local folder and likely fail

`feedback-app:2.0` — the image name and version built earlier

---

## Watch Live Changes with Docker Logs

Since nodemon is running inside the container, you can watch it detect file changes in real time:

```bash
docker logs feedb
```

To keep it running and stream new logs continuously:

```bash
docker logs -f feedb
```

Every time you save a file in your project folder, you will see nodemon restart the server in the logs.

---

## Other Useful Commands

Check running containers:
```bash
docker ps
```

Check all containers including stopped ones:
```bash
docker ps -a
```

Stop the container:
```bash
docker stop feedb
```

List all volumes:
```bash
docker volume ls
```

Delete the feedback volume if you want to start fresh:
```bash
docker volume rm feedback
```

Remove the image:
```bash
docker rmi feedback-app:2.0
```
