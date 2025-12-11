---
author: Shreya Kothari
tags:
  - docker
  - cloud
  - container
folder: cloud/docker
---

The `compose.yaml` (or `docker-compose.yaml`) file is a configuration file used by **Docker Compose**, a tool for defining and running **multi-container Docker applications**. Here's a breakdown of what it is, why you need it, and when to use it:

> [!note] Everything in compose file is called as "Desired state"
---
### 🔹 **What is `compose.yaml`?**

It's a YAML-formatted file that defines how Docker containers should run together. It includes configurations like:

- What images to use for each container
- Network and volume configurations
- Environment variables
- Port mappings
- Dependencies between services (e.g., wait for database before starting app)

---
# Structure of `docker-compose.yml`

### 1. `version`

Specifies the version of the Compose file format.
```version: "3.9"```

### 2. `services`

Defines each container. You can name each service anything you like (e.g., `nginx`, `backend`, `db`). These names are used internally for networking between containers.
services:

```yaml
services:
  nginx:
    image: nginx
  backend:
    build: ./backend

```

### 3. `image`

Pulls a prebuilt image from Docker Hub or another registry.
```yaml
image: nginx:latest
```

### 4. `build`

Builds an image from a Dockerfile in the specified directory.
Example:
```yaml
build: ./app
```

### 5. `ports`

Maps a port on your computer (host) to a port in the container.
This means: `localhost:8080` → container’s port `80`.
```yaml
ports:
  - "8080:80"
```

### 6. `volumes`

Mounts a folder from your local machine into the container. This allows you to edit code on your machine and see changes in the container.

```yaml
volumes:
  - ./code:/usr/src/app
```

### 7. `environment`

Sets environment variables inside the container.
```yaml
environment:
  - NODE_ENV=production
  - PORT=3000
```

### 8. `depends_on`

Tells Docker which services to start first. It does **not** wait for the service to be "ready," just started.
```yaml
depends_on:
  - db
```

### 9. `networks` (optional)

Used to connect services internally. Docker creates a default network if you don’t specify one.

```yaml
networks:
  default:
    driver: bridge
```

---
A simple example:

```yaml
[version: "3.8"

services:
  web:
    image: nginx:latest
    ports:
      - "8080:80"
  
  app:
    build: ./app
    depends_on:
      - db

  db:
    image: postgres:15
    environment:
      POSTGRES_PASSWORD: example](<version: "3.9"

services:
  nginx:
    image: nginx
    ports:
      - "80:80"
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
    volumes:
      - ./backend:/app

networks:
  default:
    driver: bridge>)
```

This file does the following:

- Runs an `nginx` container and exposes it on port 80.
    
- Runs a backend container (built from local code), exposes it on port 3000, and passes environment variables.
    
- Mounts local code inside the backend container. This is done using the `volumes` key. It lets you share a folder from your computer with the container.
	- "Everything inside the `./backend` folder on my computer should appear inside the container’s `/app` folder."
	
- Both containers are on the same internal network, so they can talk to each other using their service names (`nginx`, `backend`).
![[../assets/ChatGPT Image Apr 13, 2025, 03_23_23 PM.png]]
### 🔹 **When do we need it?**

You need a `compose.yaml` file when:

- Your application uses **more than one service** (e.g., a web app + a database)
- You want to **share and reuse your environment** easily (e.g., for team development or CI/CD)
- You prefer **declarative configuration** over writing long shell commands
- You want to manage **volumes, networks, and build contexts** cleanly
### 🔸 **When you don’t need it**

- For **simple one-container apps**, `docker run` or `Dockerfile` alone is sufficient.
- If you’re using **Kubernetes**, Compose might be replaced by `Helm` or native YAML manifests.
    

---
