# Docker Networks + MongoDB

In this project I learned how containers communicate with each other. The goal was to connect a Node.js app running in one container to a MongoDB database running in another container. I went through three different approaches before landing on the cleanest one using Docker networks.

---

## What I Learned

### Approach 1 — Connecting to the Local Machine

The first thing I tried was connecting the app to a MongoDB instance running on my local machine instead of inside a container. For this Docker has a special hostname:
host.docker.internal

This is a hostname that Docker provides so that containers can reach services running on your actual machine. So instead of `localhost` you use `host.docker.internal` and the container can talk to your local machine.

---

### Approach 2 — Using the Container IP Address

The next approach was running MongoDB inside its own container and connecting to it using its IP address.

First pull and run the MongoDB container:

```bash
docker run -d --name mongodb mongo
```

Then inspect it to find its IP address:

```bash
docker inspect mongodb
```

Look for `IPAddress` in the output, it will be something like `172.17.0.2`. Then paste that IP directly in the code:

```javascript
mongoose.connect(
  'mongodb://172.17.0.2:27017',
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(3000);
    }
  }
);
```

Then rebuild the image and run both containers:

```bash
docker build -t favorite-node:latest .
docker run -d --name mongodb mongo
docker run -p 3000:3000 --rm --name favorite favorite-node:latest
```

This worked but the problem is the IP address can change every time Docker restarts. So hardcoding it is not a reliable solution.

---

### Approach 3 — Docker Networks (The Right Way)

This is the cleanest approach. Instead of using an IP address you create a Docker network and put both containers inside it. When two containers are on the same network they can talk to each other using the container name as the hostname.

So the IP address in the code was replaced with the MongoDB container name:

```javascript
mongoose.connect(
  'mongodb://mongodb:27017',
  { useNewUrlParser: true },
  (err) => {
    if (err) {
      console.log(err);
    } else {
      app.listen(3000);
    }
  }
);
```

`mongodb` here is just the name of the MongoDB container. Docker automatically resolves it to the right IP inside the network so you never have to worry about IP addresses changing.

---

## Project Structure
networks-starting-setup/

├── models/

├── node_modules/

├── app.js

├── Dockerfile

├── package.json

└── package-lock.json

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

---

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/networks-starting-setup
```

---

## Build the Image

```bash
docker build -t favorite-node:latest .
```

---

## Run the App using Docker Networks

**Step 1** — Create a network

```bash
docker network create favorite-net
```

**Step 2** — Run the MongoDB container and attach it to the network

```bash
docker run -d --name mongodb --network favorite-net mongo
```

**Step 3** — Run the Node app container and attach it to the same network

```bash
docker run -p 3000:3000 --rm --name favorite --network favorite-net favorite-node:latest
```

Both containers are now on the same network so the Node app can reach MongoDB just by using `mongodb` as the hostname.

---

## Open the App
http://localhost:3000

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

List all Docker networks:
```bash
docker network ls
```

Inspect a network to see which containers are connected:
```bash
docker network inspect favorite-net
```

Inspect a container to see its IP address:
```bash
docker inspect mongodb
```

Stop a container:
```bash
docker stop favorite
docker stop mongodb
```

Remove a container:
```bash
docker rm mongodb
```

Remove the network:
```bash
docker network rm favorite-net
```

Remove the image:
```bash
docker rmi favorite-node:latest
```

---

## Key Takeaway

Using a Docker network is the right way to connect containers. You do not need to look up IP addresses or worry about them changing. Just put both containers on the same network and use the container name as the hostname in your code. That is it.

---
