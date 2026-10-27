---
created: 2026-10-25
up: 
tags: [type/note]
status: seed
---

← [[Nav/HOME|Home]] &nbsp;·&nbsp; `= this.up`

# Running Agent

- DD free trial > agent > docker

### How it works

They run **one DD agent per host** (or per Kubernetes node, as a DaemonSet), and all the apps send their traces to it.

```
Server / K8s node
 ├── Datadog Agent  (1 per node)
 ├── App A ──┐
 ├── App B ──┼──→ send traces to the agent
 └── App C ──┘
```

- You deploy the Agent **once** as a DaemonSet
- Kubernetes automatically puts **one agent pod on every node**
- New node joins? It gets an agent automatically. Node removed? Agent goes with it
- Installed via the **Datadog Helm chart** or the **Datadog Operator**

### What’s actually running on your Mac
```
Your Mac
 └── Docker Desktop (runs a small Linux VM behind the scenes)
      │
      ├── 📦 dd-agent       ← container 1
      │       ↑ traces (port 8126)
      │       │
      └── 📦 shreya-demo    ← container 2
              
      both connected via the dd-net network
```

### Mapping it to real life

| Your laptop               | Real Kubernetes cluster      |
| ------------------------- | ---------------------------- |
| Docker Desktop’s Linux VM | A node                       |
| `dd-agent` container      | Agent pod from the DaemonSet |
| `shreya-demo` container   | An app pod                   |
| `dd-net`                  | Pod networking               |
### Traces vs spans vs logs

Use a **food delivery order** as the analogy:

| Term      | What it is                                                       | Delivery analogy                                                                               |
| --------- | ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| **Trace** | The full journey of **one request**, start to finish             | The whole order: from tapping “order” to food at your door                                     |
| **Span**  | **One step** inside that journey, with a start time and duration | Each step: restaurant accepts (2 min), cooking (15 min), driver pickup (5 min), drive (12 min) |
| **Log**   | A **text message** your code writes at a moment in time          | The driver’s notes: “picked up”, “running late”, “left at door”                                |

So: **a trace is made of spans**, and **logs are separate notes** that can be linked to a trace.