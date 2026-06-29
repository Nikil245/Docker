# 🐞 Debugging a Crashed Docker Container

This is a full-stack Notes application (HTML/Nginx Frontend, Node.js Backend, and MongoDB) deliberately designed to simulate real-world container crashes. Use this project to practice your container debugging and recovery skills.

## 📥 How to Pull and Setup

1. **Clone the repository:**
   ```bash
   git clone <YOUR_GITHUB_REPOSITORY_URL_HERE>
Navigate into the project folder:

Bash
cd <YOUR_PROJECT_FOLDER_NAME>
🚀 The Launch Command
To build the images and spin up the cluster in detached mode, run:

Bash
docker compose up -d --build
Note: The containers are configured to fail on startup. It will look like it succeeded, but they are crashing in the background. It is your job to find out why.

🛠️ Essential Debugging Commands
When a container crashes, use these commands in order to perform an autopsy and find the root cause.

1. Find the Casualties (The Autopsy)
List all containers (both running and stopped) to see which ones failed and note their Exited status codes:

Bash
docker ps -a
2. Read the Black Box (Check the Logs)
Once you have the name of the crashed container from the previous step, pull its error logs to see its final output before dying:

Bash
docker logs <container_name_or_id>
3. Check for Resource Starvation (OOMKilled)
If a container disappeared without a clear error log, check if the host machine killed it for using too much memory:

Bash
docker inspect <container_name_or_id> | grep -i oom
🩹 How to Fix the Code (Recovery)
Based on the errors found in the logs, you need to make the following changes to your source files to bring the cluster back to life.

1. Fix the Frontend Crash (frontend/nginx.conf)
Nginx crashed because of a syntax error (a missing semicolon). Update the listen directive:

Nginx
server {
    # FIX: Add the missing semicolon here
    listen 80; 

    location / {
        root /usr/share/nginx/html;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
2. Fix the Backend Crash (backend/server.js)
The Node.js backend crashed because it was hard-coded to require an environment variable that didn't exist. You can either supply the variable in docker-compose.yaml, or remove the strict requirement from the code.

To fix the code directly, open backend/server.js and delete or comment out the sabotage block:

JavaScript
// --- ENV Variables ---
const PORT = process.env.PORT || 5000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost:27017/notesdb";

// FIX: Delete or comment out this entire block to allow the server to boot
// if (!process.env.SUPER_SECRET_KEY) {
//    throw new Error("CRITICAL FAILURE: System cannot boot. SUPER_SECRET_KEY is missing!");
// }
3. Restart the Cluster
Once those files are saved, tear down the broken containers and rebuild the images to apply your fixes:

Bash
docker compose down
docker compose up -d --build
Run docker ps to verify all containers are now showing an Up status!