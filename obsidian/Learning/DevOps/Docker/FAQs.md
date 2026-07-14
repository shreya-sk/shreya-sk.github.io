---
author: Shreya Kothari
up: "[[Docker MOC]]"
tags: [area/devops, topic/docker]
status: evergreen
---

← [[Notes/HOME|Home]] &nbsp;·&nbsp; [[Docker MOC]]

Some questions I encountered while learnind docker! The answers are compiled from chatgpt, docker documentation and nigel poulton online videos (pluralsight)

---
# Q: Why do multi-container apps exist? Users only visit one port..

> See [[Docker Networking]] for how ports and networks work between containers.

### 🔹 **Why do we need two containers?**

Think of containers as **isolated environments**—each one runs a specific part of your app.
**Most real-world applications are made up of multiple components**, such as:

- A **frontend** (e.g., React, Vue)    
- A **backend** (e.g., Node.js, Flask, Django)
- A **database** (e.g., PostgreSQL, MySQL)
- A **message broker** (e.g., RabbitMQ, Kafka)
- A **cache** (e.g., Redis)
    
Each of these components can live in its own container because:

- They're built using different technologies
- They need different dependencies
- You want to **scale**, restart, or update them independently
    
> 💡 **Analogy**: Imagine a restaurant. The kitchen, cashier, and delivery service are all parts of the system, but you wouldn't stuff all of them into one room. Each has its own space (container) and function.

### 🔹 **What is a multi-container app?**

A **multi-container app** is an application that runs multiple containers to deliver a complete experience.

**Example**: A blog platform

- One container runs a **web app** (e.g., Node.js server)
- Another runs the **database** (e.g., PostgreSQL)
- Maybe another runs **NGINX** as a reverse proxy
    
These containers work **together**, forming one logical application.


### 🔹 **Why would people visit apps on two separate ports?**

Usually, **users don’t directly access multiple ports**—but developers do when testing, and internal services do when communicating.

Some typical reasons for different ports:

1. **Frontend and Backend Separation**
    
    - Web app on `localhost:3000` (frontend dev server)
    - API on `localhost:5000` (backend server)
    - During development, frontend makes API calls to the backend.
        
2. **Different Services for Different Roles**
    
    - Admin panel on one port (`:8000`)
    - User-facing app on another (`:8080`)
        
3. **Container-to-container communication**
    
    - Frontend talks to the backend via its internal port
        
    - Backend talks to database on port `5432` (for PostgreSQL)
        

In production, these ports are usually **abstracted behind a reverse proxy** (like NGINX), so the end user only sees a single URL.

---
# Q: What's the difference between Docker Swarm and Multi-container apps

### Imagine you're running a **Pizza Delivery App**.

Your app has 3 parts (3 containers):

1. 🍕 `web` – handles customer orders.
    
2. 🧠 `backend` – processes orders, checks stock.
    
3. 🗃️ `database` – stores customer data and order history.
    

---

### ✅ **Multi-Container App**

This is like running **all 3 parts on your laptop**.

You use `docker-compose.yml` to define them:

```yaml
services:
  web:
    image: pizza-web
  backend:
    image: pizza-backend
  db:
    image: postgres
```

When you run:

```bash
docker-compose up    # see [[Compose file]] for full compose reference
```

➡️ All 3 containers run **together on one machine** (your laptop or a server). They **talk to each other**.

---

### 🐳 **Docker Swarm** ([[Docker Swarm]])

Now imagine your pizza app got **super popular**, and one machine isn’t enough.

You use **Docker Swarm** to:

- Run **many copies** of the `web` part (like 5 replicas).
    
- Run the app on **multiple servers**, not just one.
    
- Automatically balance traffic to the least busy container.
    

You would run:

```bash
docker swarm init           # Start a Swarm
docker service create --name web --replicas 5 pizza-web
```

➡️ Swarm will spread those 5 `web` containers across all your servers. If one server crashes, Swarm moves the container to a working one.

---

### 🔄 Key Difference:

| **Multi-container App**                        | **Docker Swarm**                                         |
| ---------------------------------------------- | -------------------------------------------------------- |
| Runs **all parts together** (web, backend, DB) | Runs **many copies of one part** across **many servers** |
| Good for small apps or development             | Good for **scaling up** when you have **a lot of users** |
| One machine                                    | Many machines (cluster)                                  |

---
