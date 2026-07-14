---
created: 2026-05-06
up: "[[Docker MOC]]"
tags: [area/devops, topic/docker]
status: seed
---

← [[Notes/HOME|Home]] &nbsp;·&nbsp; [[Docker MOC]]

#docker #devops #container

> [!info] Related Notes
> [[Docker Engine]] · [[Docker Commands]] · [[Compose file]]

---

## What is a Docker Network?

Containers are isolated by default. A network is just a way to control **which containers can talk to each other** — and what can reach them from the outside.

Think of it like subnets at work. Same idea, just for containers.

---

## Ports — Quick Recap

Your machine has one IP but runs many apps. Ports tell traffic which app to go to.

- IP address = building address (`192.168.1.5`)
- Port = apartment number (`80`, `8080`, `3306`)

| Port | Used for |
|---|---|
| 80 | HTTP |
| 443 | HTTPS |
| 3306 | MySQL |

---

## The Three Built-In Network Types

### Bridge (Default)

Docker creates a private internal network on your host (`172.17.0.0/16`). Every container joins it automatically and gets its own IP.

Containers can talk to each other, but **nothing outside can reach them** unless you publish a port:

```bash
docker run -p 8080:80 nginx
# "forward port 8080 on my machine into port 80 inside the container"
```

```
User visits 192.168.1.5:8080
        ↓
  Your machine (192.168.1.5)
        ↓  port mapping
  Container (172.17.0.2:80)
```

### Host

The container shares your machine's network directly — no bridge in the middle, no `-p` needed.

```
Bridge:   browser → machine:80 → bridge network → container:80
Host:     browser → machine:80  (which IS the container:80)
```

The container doesn't get its own IP. It shares yours. If two containers both want port 80, they clash — no separate IPs to save you.

> Host network doesn't work properly on Docker Desktop (Mac/Windows). It only behaves as expected on a native Linux machine — Docker Desktop runs a hidden Linux VM, so "host" means the VM's network, not your actual laptop.

### None

The container has zero network — completely cut off. No internet, can't reach other containers, nothing can reach it.

```bash
docker run --network=none myprocessor
```

Used for containers that process sensitive data and genuinely don't need to communicate with anything.

---

## Port Mapping in Practice

```bash
docker run -p 80:5000 kodekloud/webapp     # instance 1
docker run -p 8000:5000 kodekloud/webapp   # instance 2
docker run -p 8001:5000 kodekloud/webapp   # instance 3
```

All three run on port 5000 internally. Reachable on 80, 8000, 8001 from outside. Like three apartments all numbered 5000 inside, but the building gives them different external numbers.

![[Pasted image 20260506210444.png]]

> This is **not** load balancing — users still have to manually pick a port. Real load balancing means one address, traffic split automatically. That's what Nginx in front (or Kubernetes) does.

---

## User-Defined Networks

The default bridge works fine for simple setups. You'd create your own network when you need:

1. **Isolation** — control exactly which containers can see each other
2. **DNS** — use container names instead of fragile IPs

```bash
docker network create my-network
docker run --network=my-network --name=web nginx
docker run --network=my-network --name=api flask-app
docker run --network=my-network --name=db mysql
```

### Isolation — Security, Not Functionality

Your code already controls who calls who (`web → api → db`). The network separation is about damage control if something goes wrong.

If `web` gets compromised on the default bridge, an attacker can try to hit `db` directly. With separate networks, `web` literally cannot see `db` — it doesn't even know it exists.

```
Real app setup:

frontend-network:  web, api
backend-network:   api, db

web  → api  ✅  (same network)
api  → db   ✅  (same network)
web  → db   ✗   (different network — blocked)
```

`api` sits on both networks intentionally — it's the only bridge between the two.

---

## Embedded DNS

On a user-defined network, every container gets a **DNS name matching its container name**. Docker runs a small DNS server at `127.0.0.11` inside the network.

```python
# default bridge — you'd have to hardcode an IP:
DB_HOST = "172.17.0.3"   # breaks when container restarts and gets new IP

# user-defined network — just use the name:
DB_HOST = "db"           # Docker resolves it fresh every time
```

When `api` wants to reach `db`:
```
api: "what's the IP for db right now?"
DNS: "it's 172.17.0.4"
api: connects
```

Next time `db` restarts and gets a new IP, DNS just returns the new one. Your code never changes.

> Embedded DNS only works on user-defined networks — not the default bridge. This is the main reason to use user-defined networks.

---

## Inspecting a Network

```bash
docker network inspect backend-network
```

Returns a JSON blob showing:
- The subnet and gateway
- Which containers are on the network
- Their current IPs

```json
"Containers": {
    "abc123": {
        "Name": "db",
        "IPv4Address": "172.19.0.3/16"
    }
}
```

Useful for debugging — when a container can't connect, inspect tells you whether they're actually on the same network and what IP each got.

---

## Common Commands

```bash
docker network ls                                  # list all networks
docker network create my-network                   # create a user-defined network
docker network inspect my-network                  # see who's on it + their IPs
docker network connect my-network web              # add a running container to a network

docker run --network=my-network --name=web nginx   # attach on start
```

---

## `--link` (Legacy)

Older way to let one container reach another by name. You'll still see it in tutorials and exams:

```bash
--link <container-to-reach>:<alias>

# example:
--link mysql-db:mysql-db
# "connect me to the container named mysql-db, and I'll call it mysql-db"
```

On a user-defined network you don't need this — embedded DNS handles it automatically. `--link` is only needed on the default bridge.

---

## Full Example — Multi-Container App

```bash
docker run -d --name=mysql-db \
  --env MYSQL_ROOT_PASSWORD=db_pass123 \
  --network=wp-mysql-network \
  mysql

docker run -d --name=webapp \
  --env DB_Host=mysql-db \
  --env DB_Password=db_pass123 \
  --network=wp-mysql-network \
  -p 38080:8080 \
  kodekloud/simple-webapp-mysql
```

Both containers are on `wp-mysql-network`, so `webapp` can reach `mysql-db` by name via DNS. No `--link` needed.

---

## FAQ

**Q: Without `-p`, can I still reach the container from my browser on my laptop?**
No — bridge is isolated from your host machine too. Without `-p`, only other containers on the same bridge can reach it. Your browser (running on the host) can't. `-p` is what punches the hole.

**Q: Bridge is just on my local machine?**
Yes. The bridge network is completely invisible to the outside world. `-p` connects it to your machine's real network card, which is what WiFi friends can reach.

**Q: Can a WiFi friend reach my container?**
Only if you've published the port with `-p`. Then they can hit your laptop's IP on that port. If you're not on the same network (e.g. they're working from home), they can't reach your laptop at all — you'd need something like `ngrok` or a server with a public IP.

**Q: Why can't I just use IP addresses instead of DNS?**
You can, but container IPs change every time a container restarts. Hardcoding `172.17.0.3` works until the container restarts and gets `172.17.0.4` — then everything breaks silently. Container names don't change.

**Q: Why does separation matter if the code already controls who talks to who?**
It's not about normal operation — it's about what happens if a container gets compromised. Network separation means an attacker inside `web` can't even attempt to reach `db`. The code enforces intent; the network enforces security.

**Q: What even is localhost inside a container?**
It refers to the container itself, not your machine. If your app says "connect to `localhost:3306`", it's looking for MySQL inside that same container — not on your laptop.

**Q: What happens if two apps both want port 80?**
On the host — they clash, only one can listen on a port at a time. That's why you map them differently: `-p 8080:80` and `-p 8081:80`. Inside their own bridge networks, both containers can use port 80 fine — they each have separate IPs.

---

→ See [[Docker Commands]] for `-p`, `-v`, and networking flags in practice.
→ See [[Compose file]] for how service names act as DNS names automatically.
→ See [[../Kubernetes/Kubernetes MOC|Kubernetes]] for production-grade networking and load balancing.
