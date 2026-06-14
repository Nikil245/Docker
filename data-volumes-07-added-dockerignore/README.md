# Docker .dockerignore

This project builds on the previous volumes project. The main thing I learned here is how to use a `.dockerignore` file to stop unnecessary files from being copied into the Docker image when you build it.

---

## What I Learned

### .dockerignore

When you run `docker build`, Docker copies everything in your project folder into the image. This includes things like `node_modules`, temporary files, feedback folders and other stuff that either should not be in the image or just makes it bigger for no reason.

The `.dockerignore` file works exactly like `.gitignore` but for Docker. You list the files and folders you want Docker to skip during the build and it will not copy them into the image. This makes the build faster and the image size smaller.

In this project the `.dockerignore` contains things like:
- `node_modules` — no point copying this since npm install runs inside the container anyway
- `feedback` — this is handled by a volume so it does not need to be baked into the image
- `temp` — temporary files that are not needed in the image

---

## Project Structure
data-volumes-07-added-dockerignore/

├── pages/

├── public/

├── .dockerignore

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
cd Docker/data-volumes-07-added-dockerignore
```

---

## Build the Image

```bash
docker build -t feedback-web:3.0 .
```

Because of `.dockerignore`, Docker will skip the unnecessary files during the build so the image is cleaner and builds faster than before.

---

## Run the Container

Replace `your/project/path` with the actual path where you cloned the project on your machine:

```bash
docker run -p 3000:80 -d --rm --name feedback-app -v feedback:/app/feedback -v "your/project/path/data-volumes-07-added-dockerignore:/app:ro" -v /app/node_modules -v /app/temp feedback-web:3.0
```

For example if you cloned it to your Documents folder it would look like this:

```bash
docker run -p 3000:80 -d --rm --name feedback-app -v feedback:/app/feedback -v "/home/yourname/Documents/Docker/data-volumes-07-added-dockerignore:/app:ro" -v /app/node_modules -v /app/temp feedback-web:3.0
```

Here is what every part of this command does:

`-p 3000:80` — maps port 3000 on your machine to port 80 inside the container. Open the app at `http://localhost:3000`

`-d` — runs the container in the background so your terminal stays free

`--rm` — automatically deletes the container when it stops. Your volume data is still safe even after the container is deleted

`--name feedback-app` — gives the container a proper name instead of a random one Docker assigns. Change this to whatever name you want

---

## The 4 Volumes Explained

This project uses 4 volumes in the run command and each one does a different job:

**Volume 1 — Named Volume**
-v feedback:/app/feedback
Saves the feedback data submitted through the app. Even if the container stops or gets deleted this data stays on your machine because Docker manages it in a named volume called `feedback`.

**Volume 2 — Bind Mount**
-v "your/project/path/data-volumes-07-added-dockerignore:/app:ro"
Connects your local project folder directly to `/app` inside the container. Replace `your/project/path` with wherever you have the project on your machine. The `:ro` at the end makes it read only so the container can read your code but cannot write or modify anything in your local folder.

**Volume 3 — Anonymous Volume for node_modules**
-v /app/node_modules
Since the bind mount covers the entire `/app` folder, Docker would normally try to use the `node_modules` from your local machine. This anonymous volume tells Docker to keep the `node_modules` that was installed inside the container during the build and not let the bind mount overwrite it.

**Volume 4 — Anonymous Volume for temp**
-v /app/temp
The bind mount is read only so the container cannot write anything inside `/app`. But the app needs somewhere to write temporary files. This anonymous volume gives the `temp` folder write access even though the rest of `/app` is locked as read only.

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
docker stop feedback-app
```

List all volumes:
```bash
docker volume ls
```

Check what is inside a volume:
```bash
docker volume inspect feedback
```

Delete the feedback volume if you want to start fresh:
```bash
docker volume rm feedback
```

Remove the image:
```bash
docker rmi feedback-web:3.0
```

---

## Note

The bind mount path in the run command is specific to your machine. When you clone this project change that path to wherever the project folder is sitting on your machine. Everything else in the command stays the same.
