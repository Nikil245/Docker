# Docker Volumes — Persisting Data

This project is about understanding how data works inside Docker containers and how to make sure that data does not disappear when a container stops. By default anything you do inside a container is gone the moment it stops, volumes are the solution to that problem.

---

## What I Learned

Without volumes, every time you stop a container all the data inside it gets wiped. So if a user submitted a form or uploaded a file, it would just vanish. Volumes let Docker save that data in a separate place on your machine so even if the container stops or gets deleted, the data is still there the next time you start it.

---

## Project Structure
data-volumes-03-adj-node-code/

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
cd Docker/data-volumes-03-adj-node-code
```

---

## Build the Image

```bash
docker build -t feedback-app:2.0 .
```

The `feedback-app` is the image name and `2.0` is just the version tag. You can name it whatever you want.

---

## Run the Container with a Volume

```bash
docker run -p 3000:80 -d --rm --name feed -v feedback:/app/feedback feedback-app:2.0
```

This looks like a lot but here is what each part does:

`-p 3000:80` — maps port 3000 on your machine to port 80 inside the container. So you open the app at `http://localhost:3000`

`-d` — runs the container in the background so your terminal stays free. Without this your terminal gets locked to the container.

`--rm` — automatically deletes the container when it stops. Keeps things clean so you don't end up with a bunch of stopped containers piling up. Note that the volume data is still saved even when the container is deleted.

`--name feed` — gives the container a readable name instead of a random one Docker assigns. Change `feed` to whatever name you prefer.

`-v feedback:/app/feedback` — this is the volume part. `feedback` is the name of the volume Docker creates on your machine and `/app/feedback` is the folder inside the container it maps to. Anything saved in that folder inside the container gets stored in the volume and survives even after the container stops or is removed.

`feedback-app:2.0` — the image name and version you built earlier.

---

## Open the App

```bash
http://localhost:3000
```

---

## Useful Commands

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
docker stop feed
```

List all volumes on your machine:
```bash
docker volume ls
```

Inspect a volume to see where data is stored:
```bash
docker volume inspect feedback
```

Delete a volume (only do this if you want to wipe the data):
```bash
docker volume rm feedback
```

---

## The Key Thing About Volumes

If you run the container again with the same volume name, Docker connects it back to the same data. So anything that was saved before will still be there.

```bash
docker run -p 3000:80 -d --rm --name feed -v feedback:/app/feedback feedback-app:2.0
```

Just run the same command again and your data is right where you left it.