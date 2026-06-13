# Node.js App with Docker (Finished Version)

A more refined version of the first Docker project. This one has a cleaner Dockerfile setup after understanding how Docker layers and caching work.

---

## What Changed in the Dockerfile

The first version copied everything at once and then ran npm install. The problem with that is every time you make even a small change to your code, Docker reinstalls all the dependencies from scratch which wastes a lot of time.

In this version the Dockerfile was split into two separate COPY steps:

```dockerfile
FROM node:12

WORKDIR /app

COPY package.json /app

RUN npm install

COPY . /app

EXPOSE 80

CMD ["node", "server.js"]
```

First only `package.json` is copied, then `npm install` runs, and after that the rest of the code is copied. This way Docker can cache the npm install layer. So if you only change something in your `server.js` or any other file, Docker skips the install step entirely and uses the cached layer. It only reinstalls packages when `package.json` actually changes.

The other small change is the base image moved from `node:10` to `node:12` just to use a slightly newer version of Node.

---

## Project Structure
nodejs-app-finished/

├── public/

├── dummy/

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
cd Docker/nodejs-app-finished
```

---

## Build the Image

```bash
docker build .
```

---

## Run the App

```bash
docker run -p 3000:80  "Your container id or container name"
```

Open your browser and go to:
http://localhost:3000

---

## Docker Commands Worth Knowing

Check what containers are currently running:
```bash
docker ps
```

See all containers including stopped ones:
```bash
docker ps -a
```

List all images:
```bash
docker images
```

Stop a running container:
```bash
docker stop <container-id>
```

Remove a container:
```bash
docker rm <container-id>
```

Delete an image:
```bash
docker rmi <image-id>
```

Run in the background:
```bash
docker run -d -p 3000:80 "Your container id or container name"
```

---
