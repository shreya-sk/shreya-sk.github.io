---
created: 2026-05-06
source:
up:
related: []
tags: [area/devops, type/note]
status: seed
---

← [[HOME|Home]] &nbsp;·&nbsp; [[Docker MOC]]

# Docker Commands

---

## `docker run` — flag order matters

All flags must come **before** the image name. Everything after the image name is treated as a command to run inside the container.

```bash
docker run [FLAGS] [IMAGE] [OPTIONAL: command]
```

```bash
# wrong — -p ends up after the image name
docker run --name blue-app kodekloud/simple-webapp:blue -p 38282:8080

# correct
docker run -p 38282:8080 --name blue-app kodekloud/simple-webapp:blue
```

> Before image name = instructions to Docker
> After image name = instructions to the container

---

## `docker build -t` (tag)

`-t` gives the image a name (and optionally a version tag) when building it.

```bash
docker build -t myapp:1.0 .
#             ↑      ↑    ↑
#           name  version  build context (current directory)
```

Without `-t`, the image gets built but has no name — you'd have to reference it by its hash. The `:1.0` part is optional; omitting it defaults to `:latest`.

```bash
docker build -t shreyak19/myapp:1.0 .    # name includes Docker Hub username for pushing
```

See [[Docker Basics]] for the full build → push workflow.

---

## `docker exec`

**Q: Why does `docker exec` exist? Isn't it just a one-step process to go into the container and run a command?**

Because `docker run` always creates something **new**. If a container is already running (like nginx serving traffic), you can't `docker run` again to get inside it — that'd just spin up a second, separate container.

`docker exec` lets you talk to something **already alive**:

```bash
docker run -d nginx                          # container is running
docker exec -it <container_id> bash          # get inside that same container
```

> `docker run` = hire a new person and give them a job
> `docker exec` = walk up to someone already on shift and ask them something

---

## `docker run -d`

**Q: I don't think the terminal gets blocked when a container is running?**

It does. Without `-d`:

```bash
docker run nginx
```

Your terminal hangs — nginx is running but holding onto it, printing logs. You can't type anything. `Ctrl+C` gets it back, but also kills the container.

`-d` (detached mode) says: *"start the container, but give me my terminal back."*

```bash
docker run -d nginx    # runs in background, prompt returns immediately
```

| | Blocks terminal? | Use case |
|---|---|---|
| `docker run nginx` | Yes | Short one-shot commands (like `cat`) |
| `docker run -d nginx` | No | Long-running services (nginx, databases) |

---

## `-i` (interactive)

**Q: If an app is meant to take user input, why can't it just be designed to handle running inside a container? Why do we need `-i`?**

The app isn't the problem — Docker is. By default, Docker **closes stdin** for the container. The app inside is just doing `read from stdin` like normal, but there's nothing there. It's a dead end.

```bash
docker run centos bash -c "read name; echo Hello $name"
# fails — stdin is closed, nothing to read
```

`-i` says: *"keep stdin open and connected to my terminal."*

The app didn't need to be redesigned — the connection just needed to be turned on.

> Without `-i`: mic is muted. They ask a question, silence.
> With `-i`: mic is on, you can respond.

**Why `-i` is almost always paired with `-t`**

`-i` opens the input pipe. `-t` attaches a pseudo-terminal so it feels like a normal shell (prompt, formatting, etc.). Without `-t` it works but feels broken.

```bash
docker exec -it <container_id> bash    # -i = stdin open, -t = real terminal feel
```

---

## `-p` (port mapping)

Maps a port on your host machine to a port inside the container, so outside traffic can reach it.

```bash
docker run -p 80:5000 kodekloud/webapp
```

> "Anyone hitting port 80 on my machine — send them to port 5000 inside the container."

The container's internal IP (`172.17.0.2`) is private and unreachable from outside. Your host's IP (`192.168.1.5`) is what users hit. `-p` is the bridge between them.

You can run multiple instances of the same app on different host ports:

```bash
docker run -p 80:5000 kodekloud/webapp
docker run -p 8000:5000 kodekloud/webapp
docker run -p 8001:5000 kodekloud/webapp
```

All three containers use port 5000 internally — the host just gives them different external doors.

See [[Docker Networking]] for how this fits into Docker's network model.

---

## `-v` (volume mount)

By default, a container stores data **inside itself**. When the container is deleted, that data is gone.

```
Container (MySQL)
└── /var/lib/mysql  ← data here, dies with the container
```

`-v` tells Docker to store data on the **host** (your laptop / the machine running Docker) instead:

```bash
docker run -v /home/shreya/mydata:/var/lib/mysql mysql
```

- `/home/shreya/mydata` → folder on your machine
- `/var/lib/mysql` → where MySQL expects data inside the container

Docker links them. MySQL thinks it's writing inside the container — it's actually writing to your machine. Delete the container, data survives. Spin up a new one pointing at the same folder, data is back. See [[Docker Basics#Accessing Local files from a container - developing while hosting|Docker Basics]] for bind mounts in a Compose context.

---

## `sleep` — and the container process model

```bash
docker run ubuntu sleep 15
```

`sleep 15` is a Linux command that does nothing for 15 seconds then exits. Used in examples to keep a container alive long enough to demo or exec into it.

**Why does Ubuntu exit immediately without it?**

A container is not a running OS — it's just a process. When that process ends, the container stops. Ubuntu has no built-in long-running process, so `docker run ubuntu` exits instantly.

| Image | Built-in process | Stays alive? |
|---|---|---|
| `ubuntu` | Nothing | No — exits immediately |
| `nginx` | Web server | Yes |
| `mysql` | Database | Yes |

**How to actually use Ubuntu:**

```bash
docker run -it ubuntu bash        # interactive shell — bash is the process keeping it alive
docker run ubuntu cat /etc/os-release   # one-shot command, then exits
```

**Why install things inside a container if they disappear?**

You don't — unless you're writing a Dockerfile. Installing in a one-off container is pointless. Installing in a Dockerfile bakes it into the image, so every container from it has it pre-installed. See [[Docker Basics]] for how Dockerfiles work.

**Why is an Ubuntu container useful for debugging if it can't see the host?**

That isolation is the point. It gives you a clean, disposable environment that matches production — no leftover packages from your laptop interfering. Blow it up, your machine is fine.

---

## `docker inspect`

Returns everything Docker knows about a container — its config, network settings, mounts, environment variables, state, etc. Output is JSON.

```bash
docker inspect <container_id>
```

Useful when you need to check things like: what IP was assigned, what volumes are mounted, what env vars are set, whether it's actually running. See [[Docker Networking]] for what those IPs mean.

---

## `docker logs`

Shows the stdout/stderr output of a container — whatever the process inside has been printing.

```bash
docker logs <container_id>
```

Useful for debugging a container that's running in `-d` mode (detached), where you can't see its output directly.

```bash
docker logs -f <container_id>    # follow live, like tail -f
```
