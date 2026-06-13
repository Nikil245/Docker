# Python App with Docker

A simple Python script that generates a random number between a range you give it. This was done to learn how to containerize a Python application using Docker.

---

## What the Script Does

When you run it, it asks you to enter a minimum and maximum number. If the max is smaller than the min it will print an error and shut down. Otherwise it picks a random number between the two and prints it.

---

## Dockerfile Breakdown

```dockerfile
FROM python

WORKDIR /app

COPY . /app

CMD ["python", "rng.py"]
```

Nothing complicated here. It pulls the official Python image, sets the working directory to `/app`, copies all the project files into it, and runs `rng.py` when the container starts.

---

## Project Structure
python-app-starting-setup/

├── Dockerfile

└── rng.py

---

## Prerequisites

- [Docker](https://www.docker.com/get-started)
- [Git](https://git-scm.com/)

---

## Clone the Repository

```bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/python-app-starting-setup
```

---

## Build the Image

```bash
docker build .
```

---

## Run the Container

This script takes user input so you need two extra flags when running it:

```bash
docker run -it "container id or name"
```

`-i` keeps the input open so the container can actually receive what you type.
`-t` gives you a proper terminal so the interaction feels normal instead of just raw text.

Without both of these the script will start but freeze because Docker has no way to pass your keyboard input into the container.

---

## Docker Commands Worth Knowing

Check what is currently running:
```bash
docker ps
```

See all containers including ones that have stopped:
```bash
docker ps -a
```

Stop a running container:
```bash
docker stop <container-name-or-id>
```

---

## Already Ran it Before and Want to Run it Again

If you already built and ran the container before and it is now stopped, you do not need to build it again. Just do this:

```bash
docker ps -a
```

Find the container from the list, copy its name or ID, then run:

```bash
docker start -i <container-name-or-id>
```

This picks up right where you left off without creating a brand new container. It is the cleaner way to go instead of doing `docker run` every single time which just keeps creating new containers and cluttering your list.

---