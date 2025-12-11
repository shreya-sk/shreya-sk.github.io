---
author: Shreya Kothari
---
Cluster is a bunch of nodes with docker installed
Each node has to either be a:
- worker - Business apps
- a manager - stores our control plane

So each node, have docker installed, and they can communicate over reliable network


>[!INFO] We only have odd number of manager nodes - mostly 3 - sometimes 5
> Reason: If there is a network issue, one side will hold majory nodes (unequal division); side A will know there used to be 3, and now there is only 2 (which is majority) so they can continue to run as normal
> Similarly, the non-majority side also knows it is not the majority so it will out itself in read only mode until the issue can be rectified
>

![[../assets/Pasted image 20250413170723.png]]

## ✅ Desired State in Docker Swarm

- Docker Swarm keeps track of the **desired state** of your services.
- This means: you tell it **what you want** (e.g., "I want 3 replicas of this service"), and it ensures that this is true **at all times**.

📌 For example, if you say you want 3 containers running, and one crashes, Docker Swarm will **automatically restart it**.

---

## Creating a Swarm

Inside docker desktop terminal, run:
`docker swarm init`

- and its done! Follow the instructions as needed to add more managers or workers

```bash

docker service create \
  --name myweb \
  --replicas 3 \
  -p 8080:80 \
  nginx
```
This creates a service called `myweb` with **3 running containers (replicas)** of NGINX.
### 🔍 Check the service

`docker service ls docker service ps myweb`

### ⬆️ Scale up or down

`docker service scale myweb=5  # scale to 5 replicas`

## 🔄 Self-Healing (Auto-Recovery)

Docker Swarm constantly monitors the system and ensures the **desired state** is met.

`docker container ls  # see running containers docker container rm -f <container_id>  # forcefully remove one`

➡️ Docker Swarm will **automatically restart** a new container to replace the killed one, so that the number of replicas (e.g., 3 or 5) is always maintained.