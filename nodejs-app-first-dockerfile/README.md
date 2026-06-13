# Node.js App with Docker

A simple Node.js web application that I containerized using Docker as part of learning how Docker works.

---

## Project Structure

nodejs-app-first-dockerfile/

├── public/

├── node_modules/

├── Dockerfile

├── package.json

├── package-lock.json

└── server.js

---

## Prerequisites

Before you begin, make sure you have these installed on your machine:
- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

---

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/nodejs-app-first-dockerfile
```

---

## Building the Image

```bash
docker build .
```

The `-t` flag is just giving the image a name so its easier to refer to later.
The `.` at the end tells Docker to look for the Dockerfile in the current folder.

---

## Running the App

This is a web app so you need to map a port to access it in the browser:

```bash
docker run -p 3000:80 "Your-conatainer Id or name"
```

Once its running, open your browser and go to:
http://localhost:3000

---

## Docker Commands Worth Knowing

Check what containers are currently running:
```bash
docker ps
```

See all containers, including ones that have stopped:
```bash
docker ps -a
```

See all the images you have built:
```bash
docker images
```

Run using the image ID instead of the name:
```bash
docker run -p 3000:80 <image-id>
```

Stop a running container:
```bash
docker stop <container-id>
```

Remove a container you no longer need:
```bash
docker rm <container-id>
```

Delete an image:
```bash
docker rmi <image-id>
```

---

## Running in the Background

If you don't want the container taking up your terminal, run it in detached mode:

```bash
docker run -d -p 3000:80 nodejs-app
```

---

## Quick Walkthrough

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/nodejs-app-first-dockerfile

docker build .

docker run -p 3000:80 nodejs-app

docker ps

docker stop <container-id>
```
