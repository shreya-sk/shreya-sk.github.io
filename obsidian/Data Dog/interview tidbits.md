---
created: 2026-10-25
up: 
tags: [type/note]
status: seed
---

← [[Nav/HOME|Home]] &nbsp;·&nbsp; `= this.up`

# interview tidbits

"In K8s I’d deploy it with the Helm chart as a DaemonSet plus the Cluster Agent, so coverage scales automatically with the cluster.”

“The DaemonSet collects the data from each node. The Cluster Agent handles the cluster-wide bits and takes load off the API server.”
K8s API server
```
K8s API server
      ↑ (one connection)
Cluster Agent
      ↑ (node agents ask it for metadata)
Node Agent  Node Agent  Node Agent
   ↓           ↓           ↓
          Datadog backend
```
      

💡 **Interview gold:** SSI is a big selling point. “Customers can get APM across all their services without touching code” removes the biggest adoption barrier. Worth mentioning tomorrow.

That’s **Single Step Instrumentation (SSI)**. It installs a tracer injector on the **host** so every container gets APM automatically, with zero code changes.

💡 Nice little detail for the interview: the agent is designed to be lightweight on customer hosts, so features only fully start when they’re needed.

Datadog collapses all of that into: **see error spike → click → exact line.** That’s “reducing MTTR” (mean time to resolution), a phrase you’ll hear a lot in their sales world.

💡 **Interview point:** Datadog has **log pipelines** that parse raw text into structured fields (level, trace ID, etc.). Out-of-the-box pipelines exist for hundreds of sources: Python, nginx, Postgres... An SE would help customers set these up so their logs are actually searchable.