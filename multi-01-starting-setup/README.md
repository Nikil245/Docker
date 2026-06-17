Docker Networking + MongoDB + Frontend/Backend
This project builds on the previous Docker sections. Here I learned how to connect a MongoDB container with a Node.js backend using Docker networks, how to persist data using volumes, and how to enable live source code updates with bind mounts for both backend and frontend.

What I Learned

Data Persistence
MongoDB data must persist even if the container stops or is removed.

This is achieved by mounting a named volume (data:/data/db).

Volumes ensure that database files are stored outside the container lifecycle.


Live Source Code Update
Bind mounts connect local project folders directly into the container.

Any changes made to source code locally are reflected instantly inside the container.

This is used for both backend (/app) and frontend (/app/src) so development feels seamless.


Docker Networks
Containers communicate via a shared custom network (goal-network).

The backend connects to MongoDB using the container name (mongodb) instead of localhost.

This avoids hardcoding IPs and makes multi-container setups clean.

Updated Dockerfiles

Backend
dockerfile
FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 80
ENV MONGODB_USERNAME=root
ENV MONGODB_PASSWORD=secret
CMD ["npm","start"]

Frontend
dockerfile
FROM node
WORKDIR /app
COPY package.json .
RUN npm install
COPY . .
EXPOSE 3000
CMD ["npm","start"]
Project Structure
Code
multi-01-starting-setup/
├── backend/
│   ├── app.js
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
├── frontend/
│   ├── public/
│   ├── src/
│   ├── Dockerfile
│   ├── package.json
│   └── package-lock.json
Prerequisites
Docker

Git

Clone the Repository
bash
git clone https://github.com/Nikil245/Docker.git
cd Docker/multi-01-starting-setup
Build the Images
bash
docker build -t goal ./backend
docker build -t frontend-goal ./frontend
Run the Containers
MongoDB
bash
docker run --name mongodb --network goal-network \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=secret \
  -v data:/data/db -d mongo
Backend
bash
docker run --rm --name backend-goal --network goal-network \
  -v logs:/apps/logs \
  -v "your/project/path/multi-01-starting-setup/backend:/app" \
  -v /app/node_modules \
  -p 80:80 -d goal
Frontend
bash
docker run --name goal-frontend -d --rm -it -p 3000:3000 \
  --network goal-network \
  -v "your/project/path/multi-01-starting-setup/frontend/src:/app/src" \
  frontend-goal
  Replace your/project/path with the actual path where this project is located on your machine.

Open the App
Backend API: http://localhost:80

Frontend React App: http://localhost:3000

Useful Commands
Check running containers:

bash
docker ps
Stop a container:

bash
docker stop backend-goal
List volumes:

bash
docker volume ls
Remove a volume:

bash
docker volume rm data
Remove images:

bash
docker rmi goal frontend-goal mongo
Note
The bind mount paths in the run commands are specific to your machine. Adjust them to match your local project folder.

MongoDB root user is created in the admin database, so the backend connection string must include ?authSource=admin.

This section taught me how to ensure data must persist using volumes and how to enable live source code update using bind mounts.
