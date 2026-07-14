---
tags: [topic/kubernetes, cka, etcd, cluster-architecture]
type: note
status: in-progress
domain: "Cluster Architecture, Installation & Configuration (25%)"
up: "[[CKA Prep MOC]]"
---

← [[CKA Prep MOC]]

# etcd — CKA Study Notes

> **Tags:** #kubernetes #cka #etcd #cluster-architecture
> **Domain:** Cluster Architecture, Installation & Configuration (25% of CKA)
> **Priority:** ⭐⭐⭐ High — backup/restore is almost guaranteed on the exam

---

## What is etcd?

etcd is Kubernetes' **only persistent database**. It stores the entire state of the cluster as key-value pairs.

Think of it like a **Python dictionary saved to disk:**

```python
{
  "/registry/pods/default/nginx": "...pod data...",
  "/registry/nodes/worker-1":     "...node data...",
  "/registry/secrets/default/db": "...secret data...",
}
```

Every `kubectl get ...` → API server **reads** from etcd  
Every `kubectl create/apply` → API server **writes** to etcd

> etcd is the **source of truth**. If it's gone, the cluster state is gone.

---

## Where etcd fits in the cluster

```
You
 │
 ▼
kubectl ──► API Server ──► etcd  (read/write)
                │
                ▼
         Scheduler / Controller Manager
         (they also go through API Server → etcd)
```

> Nothing talks to etcd directly except the **API Server**.

---

## How etcd is deployed — Two modes

### Mode 1: Stacked (most common, what kubeadm uses)

etcd runs as a **static Pod** on the control plane node.

```bash
# See it running:
kubectl get pods -n kube-system | grep etcd
# etcd-controlplane   1/1   Running   ...
```

Config lives at:
```
/etc/kubernetes/manifests/etcd.yaml
```

---

### Mode 2: External

etcd runs on a **separate dedicated server** (not the control plane).  
The API server is pointed at it via:

```
--etcd-servers=https://<external-ip>:2379
```

> **CKA tip:** Figure out which mode you're dealing with before starting a backup/restore task.

```bash
# Quick check — if this returns something, it's stacked:
kubectl get pods -n kube-system | grep etcd

# If nothing, check the API server flags for --etcd-servers
cat /etc/kubernetes/manifests/kube-apiserver.yaml | grep etcd-servers
```

---

## etcdctl — The CLI Tool

`etcdctl` is the command line tool to talk to etcd.  
Think of it like `psql` for PostgreSQL, or `redis-cli` for Redis.

### The 3 basic operations

| Command | What it does |
|---|---|
| `etcdctl put name "shreya"` | Write a key-value pair |
| `etcdctl get name` | Read a value by key |
| `etcdctl del name` | Delete a key |

---

### ⚠️ The version gotcha — always trips people up

There are **two API versions** with completely different commands:

| Version 2 (default) | Version 3 (what you want) |
|---|---|
| `etcdctl set` | `etcdctl put` |
| `etcdctl backup` | `etcdctl snapshot save` |
| `etcdctl cluster-health` | `etcdctl endpoint health` |

**Default is v2. Always set v3 for CKA:**

```bash
export ETCDCTL_API=3
# or prefix every command:
ETCDCTL_API=3 etcdctl snapshot save ...
```

---

### 🔐 The cert flags — required on every command

etcd uses TLS. Every `etcdctl` command must authenticate with 3 cert files:

```bash
--cacert=/etc/kubernetes/pki/etcd/ca.crt      # trust this CA
--cert=/etc/kubernetes/pki/etcd/server.crt    # my identity
--key=/etc/kubernetes/pki/etcd/server.key     # my private key
```

> Think of it as: etcd won't open the door unless you show your ID badge every time.

**Full command skeleton:**

```bash
ETCDCTL_API=3 etcdctl <command> \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

---

### Why `kubectl exec` + `sh -c`?

When etcd is a stacked Pod, the `etcdctl` tool lives **inside the container** — not on your node directly. So you have to exec into it:

```bash
kubectl exec etcd-controlplane -n kube-system -- sh -c \
  "ETCDCTL_API=3 etcdctl get / \
  --prefix --keys-only --limit=10 \
  --cacert /etc/kubernetes/pki/etcd/ca.crt \
  --cert /etc/kubernetes/pki/etcd/server.crt \
  --key /etc/kubernetes/pki/etcd/server.key"
```

Breaking it down:

```
kubectl exec etcd-controlplane -n kube-system  → get inside the etcd Pod
-- sh -c "..."                                 → run this shell command inside it
ETCDCTL_API=3                                  → use v3 API
etcdctl get / --prefix --keys-only --limit=10  → list first 10 keys in etcd
--cacert / --cert / --key                      → auth certs
```

> This is the Kubernetes equivalent of SSH-ing into a server and running a command.

---

## Backup & Restore — The CKA Core Topic

> ⚠️ This is **almost guaranteed** to appear on the exam. Memorise the flow.

### The mental model

```
Before disaster  →  snapshot save    →  creates snapshot.db file
After disaster   →  snapshot restore →  unpacks to new folder
                 →  edit etcd.yaml   →  points etcd at new folder
                 →  etcd restarts    →  cluster is back ✅
```

---

### Step 1 — Backup (snapshot save)

```bash
ETCDCTL_API=3 etcdctl snapshot save /opt/snapshot.db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key
```

Verify it worked:

```bash
ETCDCTL_API=3 etcdctl snapshot status /opt/snapshot.db
```

> The exam will tell you where to save the file — just swap `/opt/snapshot.db` with the given path.

---

### Step 2 — Restore (snapshot restore)

**Part A — Unpack the snapshot into a new folder:**

```bash
ETCDCTL_API=3 etcdctl snapshot restore /opt/snapshot.db \
  --data-dir=/var/lib/etcd-from-backup
```

This just **writes files to a new directory**. It doesn't restart etcd or touch the live cluster yet.

---

**Part B — Tell etcd to use the new folder:**

```bash
vi /etc/kubernetes/manifests/etcd.yaml
```

Find the volumes section and update the path:

```yaml
volumes:
  - hostPath:
      path: /var/lib/etcd-from-backup   # ← change this to your new folder
      type: DirectoryOrCreate
    name: etcd-data
```

Save and exit → etcd Pod **restarts automatically** and boots with the restored data.

---

### The 3 most common mistakes on exam day

| Mistake | Fix |
|---|---|
| Forgot `ETCDCTL_API=3` | Commands fail silently or give wrong output — always set it |
| Forgot cert flags | etcd refuses the connection — all 3 are required |
| Didn't update `etcd.yaml` after restore | etcd still points at old data — the most common one |

---

## Quick Reference Cheat Sheet

| Task | Command / Location |
|---|---|
| Set v3 API | `export ETCDCTL_API=3` |
| Default port | `2379` |
| Cert directory | `/etc/kubernetes/pki/etcd/` |
| Stacked Pod manifest | `/etc/kubernetes/manifests/etcd.yaml` |
| Backup | `etcdctl snapshot save <path>` |
| Restore | `etcdctl snapshot restore <path> --data-dir=<new-dir>` |
| Check health | `etcdctl endpoint health` |
| Check if stacked | `kubectl get pods -n kube-system \| grep etcd` |

---

## Questions I Had (and Answers)

**Q: I thought etcd was just automatically there — do I have to set it up myself?**  
A: With kubeadm it's set up automatically as a static Pod. But in bare-metal / hard-way installs, you configure it yourself as a systemd service. The CKA tests both scenarios.

**Q: What do the backup/restore/get commands actually do?**  
A: etcd is just a database. `put`/`get` are write/read. `snapshot save` is like Cmd+S on your whole cluster — it freezes state into a file. `snapshot restore` unpacks that file into a fresh folder.

**Q: Why is there `bash` / `sh -c` in the commands?**  
A: When etcd is a stacked Pod, `etcdctl` lives inside the container. `kubectl exec ... -- sh -c` is how you run commands inside a container — like SSH for pods.

---

## Related Topics

- [[Kubernetes Control Plane Components]]
- [[CKA — Cluster Architecture Domain]]
- [[Static Pods]]
- [[TLS Certificates in Kubernetes]]
