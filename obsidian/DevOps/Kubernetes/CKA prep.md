---
author: Shreya Kothari
---
> [!INFO] Important Links:
> - [Certification Tips](https://docs.linuxfoundation.org/tc-docs/certification/tips-cka-and-ckad)
> - [CKA Curriculum](https://github.com/cncf/curriculum/blob/master/CKA_Curriculum_v1.32.pdf)
> - [CKA KodeKloud notes](https://github.com/kodekloudhub/certified-kubernetes-administrator-course)
> - [[YAML - k8s|Yaml in Kubernetes]]

**ETCD
- Key, Val store: Json files storage, so data can have
- Stores info - any logging
- Default port where etcd listen: 2379

**Kube API Server**

This diagram combines the **Kubernetes structure** with the **university analogy** we discussed earlier:

---
### **Top: Cluster**
- The **“Kubernetes Cluster”** box at the top represents the whole system.
- Analogy: This is like the **university** 🏫 — it contains everything.
---
### **Middle: Nodes**
- Inside the cluster are **Node 1, Node 2, Node 3**.
- Analogy: Each node is like a **classroom** 🏢 in the university.
- Each classroom can host several groups of students.
---
### **Pods (student groups)**
- Inside each node, you see a **Pod** with student icons.
- Analogy: Each **Pod = one group of students** working on a project together.
- All students in a group sit in the **same classroom (node)**.
---
### **Kubelet (Node Monitor)**
- **Node = Classroom** 🏢
- **Kubelet = Classroom Assistant / Teacher’s aide** 👩‍🏫
    - The kubelet makes sure that all **student groups (pods)** in the classroom are actually **working on their projects (running correctly)**.
    - It checks that every **student (container)** is present, doing their work, and reports back to the **university administration (API server)** if anything goes wrong.
---
### **Containers (students)**
- Each pod contains **Containers**.
- Analogy: Each **Container = individual student** 👩‍🎓👨‍🎓 in the group.
- Students in the same group share resources (like books or tables), just as containers in a pod share the same network/storage.
---
### ✅ Key Takeaways
1. **Cluster** (university) → has many **Nodes** (classrooms).
2. **Node** → hosts many **Pods** (student groups).
3. **Pod** → contains one or more **Containers** (students).
4. A **pod lives entirely on one node**, but you can create **replicas of the same pod** across nodes for scaling and reliability.
---
 ### **Flow in the Analogy**
7. **Administration (control plane)** decides which student groups should be active and where.
8. **Classroom assistants (kubelets)** get the instructions and make it happen.
9. **Students (containers)** do the actual work in groups (pods).
10. **Assistants report back** on attendance, progress, or issues to the administration.
---
✅ **Key Idea:**
- **Control plane = university admin → plans & delegates**
- **Kubelet = classroom assistant → executes & monitors**
- **Pods & container = students & groups → do the work**
![[Pasted image 20250828161504.png]]
# POD-2-POD Communication

---
### **1️⃣ Pod-to-Pod Communication**
- **Fact:** In Kubernetes, **every pod can reach every other pod**, even if they are on different nodes
- **How:** This is done through a **pod network**, which is a virtual network spanning all nodes in the cluster. Every pod gets its own IP and can talk to others directly.

**Analogy:**
- Each **student group (pod)** can talk to any other **student group** across the university, regardless of which classroom (node) they’re in. There’s a “university-wide internal phone network” (pod network) connecting them all.
---
### **2️⃣ Pods Have Ephemeral IPs**
- **Problem:** Each pod gets an IP, but that IP can **change** if the pod restarts or is recreated.
- If your web app tries to reach the database pod directly using its IP, it might fail if the database pod gets a new IP.

**Analogy:**
- Imagine a student changes classrooms every week. If you try to contact them by classroom number, you might reach the wrong student next week.
---
### **3️⃣ Services Solve the IP Problem**
- A **Service** is a **stable, virtual IP and name** that points to one or more pods.
- Your web app can access the database **using the service name**, e.g., `DB`, rather than the pod’s IP.
- The service automatically forwards traffic to the correct pod(s), even if their IP changes.

**Analogy:**
- Instead of calling a student by their current classroom, you call the **student group’s office extension (service)**. The office assistant (service) always knows which classroom the student is in and connects your call.
---
### **4️⃣ Services Aren’t Real Pods**

- Important point: **A Service is not a container/pod.**
- It doesn’t run code or have its own network interfaces. It exists only **in Kubernetes memory** as a virtual concept.

**Analogy:**
- The “office extension” isn’t a student; it’s just a virtual contact point maintained by the administration.
---
### **5️⃣ How Service Routing Works: Kube-Proxy**

- **Kube-proxy** runs on **every node**.
- Its job is to watch for **new services** and configure rules on the node to route traffic to the correct pods.
- Example: Traffic sent to `10.96.0.12` (service IP) gets forwarded to `10.32.0.15` (actual pod IP) using **iptables or similar networking rules**.

**Analogy:**
- Every classroom has a **local assistant (kube-proxy)**.
- When someone calls a student group’s office number, the assistant checks which classroom the student is in and **forwards the call** correctly.
- Even if the student moves to a new classroom, the assistant updates the forwarding rules automatically.
- **Kubelet** = manages **the actual work inside the node**.
- **Kube-proxy** = manages **how traffic reaches the pods from other nodes/services**
---
### **6️⃣ Key Takeaways**
1. **Pod network**: Connects all pods across nodes (students can talk to each other).
2. **Pods’ IPs are ephemeral**: Direct IP-based communication can break.
3. **Service**: Provides a stable name/IP to reach a group of pods (like an office extension).
4. **Kube-proxy**: Runs on every node to route traffic from services to pods (like a classroom assistant forwarding calls).
---
✅ **Bottom line:**
- **Pods do the work**, **Services give stable access**, and **kube-proxy makes the traffic reach the right pod** across the cluster.