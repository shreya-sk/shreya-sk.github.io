---
created: 2026-05-06
source:
up:
related: []
tags: [area/devops, type/note]
status: seed
---

← [[HOME|Home]] &nbsp;·&nbsp; [[Docker MOC]]

# Docker Workflow

---

## Shipping vs Deploying

| Term | What it means |
|---|---|
| **Shipping** | Finished building, packaged it (as a Docker image), made it available |
| **Deploying** | Actually running that package somewhere so people can use it |

Docker Hub is for shipping. Cloud servers are for deploying.

---

## What Docker Hub Actually Is

Not a marketplace for end users — it's a warehouse for developers and DevOps. You push images there for internal use, version control, and as a source for deployment pipelines.

End users never touch Docker Hub. They hit a URL.

---

## The Full Flow

```
Build app
    ↓
Push image to Docker Hub (warehouse)    ← see [[Docker Basics]] for how to build & push
    ↓
DevOps / pipeline pulls it, runs internal tests
    ↓
Deploy to cloud server (AWS, Azure, etc.) — public facing
    ↓
End users hit that server via a URL
    ↓
Load balancer distributes traffic across multiple instances    ← see [[Docker Networking#Is This Load Balancing?|Docker Networking]]
```

---

## Real Example — Spotify

- Builds app, pushes Docker image to their **private** registry
- Deploys to AWS servers across multiple regions
- [[../Kubernetes/Kubernetes MOC|Kubernetes]] (or similar) handles load balancing and scaling across instances
- You visit spotify.com — Docker is invisible to you

---

## Why Not Just Give Users a Docker Hub Link?

Most end users don't have Docker installed and won't use a terminal. Docker Hub is internal plumbing. The cloud server is the shop front.

| Audience | What you do |
|---|---|
| Developers | Push to Docker Hub — they pull and run it |
| Non-technical users | Host it on a server, they visit a URL |
| Businesses | Private registry → deployment pipeline → cloud |
