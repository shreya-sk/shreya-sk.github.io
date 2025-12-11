const e=`---
def-type: consolidated
tags:
  - glossary
  - definitions
folder: Glossary
---

## def-type: consolidated
---

# Docker

_Containerization Platform_

A platform that packages applications and their dependencies into standardized units called containers. Docker makes it easy to build, ship, and run applications consistently across different environments (development, testing, production) by isolating software from its surroundings.

Think of Docker as a shipping container for software - everything the application needs is packed inside, and it works the same way no matter where you run it.

Example: A developer can build a Docker container with a web application and its database on their laptop, and it will run exactly the same way when deployed to the cloud.

---
# Compose

_compose, docker-compose_

The \`compose.yaml\` (or \`docker-compose.yaml\`) file is a configuration file used by Docker Compose, a tool for defining and running multi-container Docker applications.


---
# Container

_Docker Container, Isolated Environment_

A lightweight, standalone, executable package that includes everything needed to run a piece of software: code, runtime, system tools, libraries, and settings. Containers are isolated from each other and from the host system, but share the operating system kernel.

Unlike virtual machines, containers don't need a full operating system for each application, making them more efficient and faster to start.

Example: One container might run a web server, while another runs a database, both on the same host but completely isolated from each other.

---

# Container Image

_Docker Image, Application Package_

A lightweight, standalone, executable package that contains everything needed to run an application - code, runtime, libraries, environment variables, and configuration files. It's essentially a template from which containers are created.

Think of an image as a snapshot or blueprint of an application and its environment. Images are immutable - once created, they don't change.

Example: The official MySQL image contains everything needed to run a MySQL database server.

---
# Docker Swarm

_swarm

**Docker Swarm** is Docker’s **native clustering and orchestration tool**, designed to turn a group of Docker engines (hosts) into a **single, virtual Docker engine**. It enables **deployment, scaling, and management** of containerized applications across multiple machines with ease.
Like kubernetes, but slightly simpler

---
# Docker Stack

_stack

Similar to docker compose, but for swarm. **Deploy and manage a group of services** (like a multi-container app) on a **Docker Swarm** cluster using a single command and a **YAML file**.

- Docker Stack is **like a production-ready Compose**.
    
- It uses **Swarm mode** to deploy services on multiple nodes.
    
- If a container (replica) fails, **Swarm restores it** to maintain the desired state.

---

# Dockerfile

_Build Instructions, Image Definition_

A text file containing a series of instructions that Docker uses to automatically build an image. Each instruction creates a layer in the image and represents a step in the build process.

Think of a Dockerfile as a recipe for creating a container image - it specifies what base image to use, what files to copy, what commands to run, and how to configure the environment.

Example: A simple Dockerfile might start with Ubuntu, install Node.js, copy application files, and specify the command to run the application.

\`\`\`
FROM node:14
WORKDIR /app
COPY . .
RUN npm install
CMD ["npm", "start"]
\`\`\`

---

# Docker Compose

_Multi-Container Tool, Service Orchestration_

A tool for defining and running multi-container Docker applications. With Compose, you use a YAML file to configure your application's services, networks, and volumes, and then create and start all the containers with a single command.

Think of it as a way to manage a group of related containers that work together - like a web application that needs a database and cache server.

Example: A Docker Compose file might define three services: a web application, a database, and a Redis cache, along with their configurations and how they connect to each other.

---

# Registry

_Docker Registry, Image Repository_

A centralized storage and distribution system for Docker images. Registries allow you to push (upload) images you've built and pull (download) images others have created.

The most common registry is Docker Hub, but companies often run private registries to store their proprietary images securely.

Example: When you run \`docker pull mysql\`, Docker downloads the MySQL image from Docker Hub, which is a public registry.

---

# Docker Hub

_Public Registry_

The default public registry for Docker images, maintained by Docker, Inc. It hosts thousands of public images from software vendors, open-source projects, and the community.

Think of it as an app store for container images - you can find official images for most popular software and build upon them.

Example: Official images for databases (MySQL, MongoDB), web servers (Nginx, Apache), and programming languages (Python, Node.js) are all available on Docker Hub.

---

# Volume

_Docker Storage, Persistent Data_

A mechanism for persisting data generated by and used by Docker containers. Volumes are stored on the host file system but managed by Docker, and they exist independently of container lifecycles.

Volumes solve the problem of data persistence in containers - since containers are typically ephemeral (temporary), volumes provide a way to store data that should survive container restarts or removals.

Example: A database container would use a volume to store its data files, ensuring the data persists even if the container is replaced or updated.

---

# Layer

_Docker Image Layer, Filesystem Layer_

A modification to a Docker image, represented by an instruction in a Dockerfile. Images consist of multiple read-only layers that are stacked on top of each other, with changes in each layer.

The layered approach makes image building efficient - layers are cached, so unchanged layers don't need to be rebuilt when updating an image.

Example: In a Dockerfile, each command (\`FROM\`, \`RUN\`, \`COPY\`, etc.) creates a new layer in the resulting image.

---

# Tag

_Docker Image Tag, Version Identifier_

A label applied to Docker images to identify specific versions or variants. The default tag is "latest" if none is specified, but explicit tags help ensure you're using the exact version you intend.

Think of tags like version numbers or edition names for software.

Example: \`nginx:1.21\` refers to version 1.21 of the Nginx web server image, while \`python:3.9-slim\` refers to Python 3.9 with a minimal base image.

---

# Open Container Initiative

_OCI, Container Standards_

An industry standards organization focused on creating open standards for container formats and runtimes. The OCI maintains specifications that enable compatibility and interoperability across container tools and implementations.

The OCI was established to ensure that container technologies remain open and standardized, preventing vendor lock-in.

Example: Docker images follow the OCI Image Specification, which means they can be used with other OCI-compliant tools like Podman or containerd.

---

# Namespace

_Container Isolation, Linux Feature_

A feature of the Linux kernel that isolates and virtualizes system resources for a collection of processes. In Docker, namespaces provide the isolated workspace called a container.

Different types of namespaces isolate different aspects:

- PID namespace: Process isolation
- NET namespace: Network interfaces
- MNT namespace: Filesystem mount points
- UTS namespace: Hostname and domain name
- IPC namespace: Inter-process communication resources

Example: Each container has its own PID namespace, which means it has its own isolated process tree starting with PID 1.

---

# Cgroup

_Control Group, Resource Limitation_

A Linux kernel feature that limits, accounts for, and isolates resource usage (CPU, memory, disk I/O, network, etc.) of process groups. Docker uses cgroups to enforce resource constraints for containers.

Think of cgroups as the mechanism that ensures one container can't use all the CPU or memory on a host, starving other containers.

Example: You can use Docker's resource constraints to limit a container to use only 50% of a CPU core and 512MB of memory.

---

# Docker Swarm

_Container Orchestration, Clustering_

Docker's native clustering and orchestration solution for Docker containers. It allows you to create and manage a swarm of Docker nodes, running containers across multiple machines.

While Kubernetes has become more popular for complex orchestration, Docker Swarm provides a simpler alternative that's tightly integrated with the Docker ecosystem.

Example: A company might use Docker Swarm to distribute their application containers across a cluster of servers for high availability and load balancing.

---

# Multi-stage Build

_Docker Build Optimization_

A feature in Docker that allows you to use multiple FROM statements in your Dockerfile. Each FROM instruction can use a different base image, and begins a new stage of the build.

This enables you to copy artifacts from one stage to another, leaving behind everything you don't need in the final image, resulting in smaller, more efficient images.

Example: A multi-stage build might use a large image with compilers to build your application in the first stage, then copy just the compiled binary to a minimal image in the second stage.

---

# Docker Daemon

_Docker Engine, Container Runtime_

The background service that manages Docker objects such as images, containers, networks, and volumes. The daemon listens for Docker API requests and manages Docker objects.

Think of it as the core of Docker that does all the heavy lifting of container management.

Example: When you run a Docker command like \`docker run\`, you're communicating with the Docker daemon, which then creates and manages the container.

---

# Docker Client

_Docker CLI, Command Line Tool_

The primary way users interact with Docker. The client sends commands to the Docker daemon, which carries them out. The docker command uses the Docker API to communicate with the daemon.

Example: Commands like \`docker build\`, \`docker pull\`, and \`docker run\` are all executed through the Docker client.

---

# Docker Network

_Container Networking_

A virtual network that allows containers to communicate with each other and with the outside world. Docker provides several network drivers for different use cases.

Common network types include:

- Bridge: The default network for containers on a single host
- Host: Removes network isolation between container and host
- Overlay: Connects containers across multiple Docker hosts
- Macvlan: Assigns a MAC address to a container, making it appear as a physical device on the network

Example: A web application container and a database container can be placed on the same network to communicate securely while isolating them from other containers.

---

# Docker Compose File

_docker-compose.yml, Service Definition_

A YAML file used by Docker Compose to define services, networks, and volumes for a multi-container Docker application. It specifies everything needed to run your application stack.

Example: A typical docker-compose.yml might define a web service, a database service, and a cache service, along with their configurations, dependencies, and networking.

\`\`\`yaml
version: '3'
services:
  web:
    image: nginx
    ports:
      - "80:80"
  database:
    image: postgres
    environment:
      POSTGRES_PASSWORD: example
\`\`\`

---

# Container Orchestration

_Automated Container Management_

The automated arrangement, coordination, and management of containers at scale. Container orchestration handles deployment, scaling, networking, load balancing, and health monitoring of containerized applications.

Popular container orchestration platforms include Kubernetes, Docker Swarm, and Amazon ECS.

Example: An e-commerce site might use container orchestration to automatically scale up the number of web server containers during a sales event to handle increased traffic.`;export{e as default};
