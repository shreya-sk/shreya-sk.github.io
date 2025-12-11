---
author: Shreya Kothari
---

## 🚀 Essential Setup & Aliases
```bash
# Must-have aliases (add to ~/.bashrc in exam)
alias k=kubectl
alias kgp='kubectl get pods'
alias kgs='kubectl get svc' 
alias kgd='kubectl get deployments'
alias kgn='kubectl get nodes'
export do='--dry-run=client -o yaml'    # Super useful: k create deploy nginx --image=nginx $do
export now='--force --grace-period=0'   # Force delete: k delete pod nginx $now

# Quick context switching
kubectl config get-contexts                    # List all contexts
kubectl config use-context %3Ccontext-name%3E      # Switch context
kubectl config set-context --current --namespace=<ns>  # Set default namespace
```

---

## 📦 Pod Management
```bash
# Basic pod operations
kubectl run nginx --image=nginx                # Create single pod
kubectl run busybox --image=busybox -it --rm -- /bin/sh  # Interactive pod (auto-delete)
kubectl get pods -o wide --show-labels         # Detailed pod info with labels
kubectl get pods --field-selector=status.phase=Running  # Filter by status
kubectl get pods --selector=app=nginx          # Filter by labels

# Pod inspection & debugging
kubectl describe pod <pod-name>                # Detailed pod info
kubectl logs <pod-name> -f                     # Follow logs in real-time
kubectl logs <pod-name> -c <container>         # Logs from specific container
kubectl logs <pod-name> --previous             # Logs from crashed container
kubectl exec -it <pod-name> -- /bin/bash       # Shell into pod
kubectl exec -it <pod-name> -c <container> -- /bin/sh  # Shell into specific container

# Pod utilities
kubectl port-forward pod/<pod-name> 8080:80    # Port forward to local machine
kubectl cp file.txt <pod-name>:/tmp/           # Copy file to pod
kubectl cp <pod-name>:/tmp/file.txt ./file.txt # Copy file from pod
```

---

## 🔄 Deployments & ReplicaSets
```bash
# Deployment lifecycle
kubectl create deployment nginx --image=nginx  # Create deployment
kubectl get deployments -o wide                # View deployments with details
kubectl scale deployment nginx --replicas=5    # Scale up/down
kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80  # HPA

# Rolling updates & rollbacks
kubectl set image deployment/nginx nginx=nginx:1.20  # Update image
kubectl rollout status deployment/nginx        # Watch rollout progress
kubectl rollout history deployment/nginx       # View rollout history
kubectl rollout undo deployment/nginx          # Rollback to previous version
kubectl rollout undo deployment/nginx --to-revision=2  # Rollback to specific revision

# Deployment management
kubectl edit deployment nginx                   # Edit deployment in-place
kubectl patch deployment nginx -p '{"spec":{"replicas":3}}'  # Patch specific field
```

---

## 🌐 Services & Networking
```bash
# Service creation
kubectl expose pod nginx --port=80 --target-port=80  # ClusterIP service
kubectl expose deployment nginx --port=80 --type=NodePort    # NodePort service
kubectl expose deployment nginx --port=80 --type=LoadBalancer  # LoadBalancer service

# Service management
kubectl get svc -o wide                        # List services with details
kubectl describe svc nginx                     # Service details & endpoints
kubectl get endpoints                          # View service endpoints

# Network debugging
kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash  # Network debug pod
kubectl exec -it tmp-shell -- nslookup kubernetes.default  # DNS testing
```

---

## 🗂️ ConfigMaps & Secrets
```bash
# ConfigMap operations
kubectl create configmap app-config --from-literal=key1=value1 --from-literal=key2=value2
kubectl create configmap app-config --from-file=config.properties  # From file
kubectl create configmap app-config --from-env-file=.env  # From env file
kubectl get configmap app-config -o yaml       # View ConfigMap content

# Secret operations  
kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=secret123
kubectl create secret docker-registry regcred --docker-server=myregistry.com --docker-username=user --docker-password=pass
kubectl create secret tls tls-secret --cert=path/to/cert --key=path/to/key  # TLS secret
kubectl get secrets -o yaml                    # View all secrets (base64 encoded)

# Using in pods (remember these patterns)
# env:
# - name: DB_USER
#   valueFrom:
#     secretKeyRef: {name: db-secret, key: username}
# volumeMounts:
# - name: config-volume
#   mountPath: /etc/config
```

---

## 🏠 Namespace Management
```bash
kubectl get namespaces                         # List all namespaces
kubectl create namespace development           # Create namespace
kubectl delete namespace development           # Delete namespace (careful!)

# Working across namespaces
kubectl get pods -A                           # All pods in all namespaces
kubectl get pods -n kube-system               # Pods in specific namespace
kubectl config set-context --current --namespace=development  # Set default namespace

# Resource quotas (important for CKA)
kubectl create quota dev-quota --hard=pods=10,secrets=5 -n development
kubectl describe quota -n development         # View quota usage
```

---

## ⏰ Jobs & CronJobs
```bash
# Job creation
kubectl create job pi-calc --image=perl -- perl -Mbignum=bpi -wle 'print bpi(2000)'
kubectl create job backup --image=busybox -- /bin/sh -c 'tar czf /backup.tar.gz /data'

# CronJob creation  
kubectl create cronjob backup --schedule="0 2 * * *" --image=busybox -- /bin/sh -c 'backup command'
kubectl create cronjob cleanup --schedule="*/30 * * * *" --image=busybox -- /bin/sh -c 'cleanup'

# Job management
kubectl get jobs                               # View jobs
kubectl describe job pi-calc                  # Job details
kubectl logs job/pi-calc                      # Job logs
kubectl delete job pi-calc                    # Clean up completed job
```

---

## 💾 Persistent Volumes & Claims
```bash
# PV & PVC operations
kubectl get pv,pvc                            # View volumes and claims
kubectl describe pv <pv-name>                 # PV details
kubectl describe pvc <pvc-name>               # PVC details and binding status

# Quick PVC creation (memorize this pattern)
kubectl create -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes: ["ReadWriteOnce"]              # RWO, RWX, ROX
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard                  # Optional: specify storage class
EOF
```

---

## 🔐 RBAC & Security
```bash
# View RBAC resources
kubectl get roles,rolebindings -A             # All roles and bindings
kubectl get clusterroles,clusterrolebindings  # Cluster-wide permissions
kubectl get sa                                # Service accounts

# Create RBAC resources
kubectl create role pod-reader --verb=get,list,watch --resource=pods
kubectl create clusterrole node-reader --verb=get,list --resource=nodes
kubectl create rolebinding pod-reader-binding --role=pod-reader --user=jane
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=admin

# Permission testing (very useful!)
kubectl auth can-i create pods                # Test your permissions
kubectl auth can-i create pods --as=system:serviceaccount:default:my-sa  # Test as service account
kubectl auth can-i '*' '*' --as=system:serviceaccount:kube-system:default  # Test wildcard permissions
```

---

## 🛡️ Network Policies
```bash
# Get network policies
kubectl get networkpolicies -A               # View all network policies
kubectl describe networkpolicy <policy-name> # Policy details

# Common NetworkPolicy patterns (know these!)
# Deny all ingress traffic
kubectl create -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}                             # Applies to all pods
  policyTypes: ["Ingress"]
EOF

# Allow specific ingress
kubectl create -f - <<EOF  
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes: ["Ingress"]
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - port: 8080
EOF
```

---

## 🏥 Cluster Maintenance & Troubleshooting
```bash
# Node management
kubectl get nodes -o wide                     # Node status and info
kubectl describe node <node-name>             # Detailed node info
kubectl cordon <node-name>                    # Mark node unschedulable
kubectl drain <node-name> --ignore-daemonsets --force  # Evict pods from node
kubectl uncordon <node-name>                  # Mark node schedulable again

# Cluster health
kubectl get componentstatuses                 # Check cluster components (deprecated but useful)
kubectl cluster-info                          # Basic cluster info
kubectl cluster-info dump                     # Detailed cluster dump
kubectl get events --sort-by=.metadata.creationTimestamp  # Recent cluster events

# Resource monitoring
kubectl top nodes                             # Node resource usage (requires metrics-server)
kubectl top pods -A                           # Pod resource usage across all namespaces
kubectl top pods --containers                 # Container-level resource usage
```

---

## 💾 ETCD Backup & Restore (Critical!)
```bash
# ETCD backup (memorize this!)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot-$(date +%Y%m%d-%H%M%S).db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db

# ETCD restore (practice this!)
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore \
  --name=master \
  --initial-cluster=master=https://127.0.0.1:2380 \
  --initial-advertise-peer-urls=https://127.0.0.1:2380

# Remember to update /etc/kubernetes/manifests/etcd.yaml with new data-dir
# and restart kubelet: systemctl restart kubelet
```

---

## 🔧 Advanced Debugging & Utilities
```bash
# Advanced pod filtering
kubectl get pods --field-selector=status.phase=Failed        # Failed pods only
kubectl get pods --field-selector=spec.nodeName=worker-1     # Pods on specific node
kubectl get pods --selector=environment!=production          # Exclude production pods

# Resource manipulation
kubectl patch pod nginx -p '{"metadata":{"labels":{"env":"prod"}}}'  # Add label
kubectl annotate pod nginx description="My nginx pod"        # Add annotation
kubectl label pod nginx env=production                       # Add label (alternative)

# JSON path queries (advanced but powerful)
kubectl get pods -o jsonpath='{.items[*].metadata.name}'     # Get all pod names
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'  # Get all images
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'  # Node IPs

# Quick YAML generation (exam time-savers)
kubectl create deployment nginx --image=nginx $do > deploy.yaml      # Generate deployment YAML
kubectl create service clusterip nginx --tcp=80:80 $do > svc.yaml    # Generate service YAML
kubectl create job backup --image=busybox $do -- /bin/sh -c 'echo backup' > job.yaml

# Temporary debugging pods
kubectl run debug-pod --image=busybox -it --rm -- /bin/sh    # Temporary debug pod
kubectl run netshoot --image=nicolaka/netshoot -it --rm -- /bin/bash  # Network debugging
kubectl run curl --image=curlimages/curl -it --rm -- /bin/sh # HTTP debugging
```

---

## 🎯 Exam-Specific Tips & Tricks

### Time-Saving Commands
```bash
# Use these frequently during exam
kubectl api-resources                          # List all resource types and shortcuts
kubectl explain pod.spec.containers           # Get field documentation
kubectl explain deployment --recursive | grep -i volume  # Search for specific fields

# Quick resource creation without YAML files
kubectl create deployment nginx --image=nginx --port=80 --replicas=3
kubectl expose deployment nginx --type=NodePort --port=80
kubectl create configmap app-config --from-literal=env=prod --from-literal=debug=false
```

### Common Exam Patterns
```bash
# Multi-container pod (sidecar pattern)
kubectl run webapp --image=nginx --dry-run=client -o yaml > webapp.yaml
# Then edit to add second container manually

# Init container pattern  
kubectl run myapp --image=busybox --dry-run=client -o yaml > myapp.yaml
# Add initContainers section manually

# Resource limits and requests
kubectl run limited-pod --image=nginx --requests='cpu=100m,memory=128Mi' --limits='cpu=200m,memory=256Mi' --dry-run=client -o yaml > limited.yaml
```

### Must-Know Shortcuts
- `po` = pods
- `svc` = services  
- `ns` = namespaces
- `deploy` = deployments
- `rs` = replicasets
- `ds` = daemonsets
- `sts` = statefulsets
- `cm` = configmaps
- `pv` = persistentvolumes
- `pvc` = persistentvolumeclaims
- `sa` = serviceaccounts

### Final Exam Checklist
- [ ] Set up aliases immediately
- [ ] Practice ETCD backup/restore until muscle memory
- [ ] Know YAML generation with `--dry-run=client -o yaml`
- [ ] Master `kubectl explain` for field documentation
- [ ] Practice NetworkPolicy creation from memory
- [ ] Understand RBAC role vs clusterrole differences
- [ ] Know how to troubleshoot failed pods with `describe` and `logs`
- [ ] Practice node maintenance (cordon/drain/uncordon)

---

**🏆 Remember**: Speed comes from practice, not just knowing commands. Practice these scenarios until they become automatic!>)](<# 🎯 Complete CKA `kubectl` Cheat Sheet

## 🚀 Essential Setup & Aliases
```bash
# Must-have aliases (add to ~/.bashrc in exam)
alias k=kubectl
alias kgp='kubectl get pods'
alias kgs='kubectl get svc' 
alias kgd='kubectl get deployments'
alias kgn='kubectl get nodes'
export do='--dry-run=client -o yaml'    # Super useful: k create deploy nginx --image=nginx $do
export now='--force --grace-period=0'   # Force delete: k delete pod nginx $now

# Quick context switching
kubectl config get-contexts                    # List all contexts
kubectl config use-context %3Ccontext-name%3E      # Switch context
kubectl config set-context --current --namespace=<ns>  # Set default namespace
```

---

## 📦 Pod Management
```bash
# Basic pod operations
kubectl run nginx --image=nginx                # Create single pod
kubectl run busybox --image=busybox -it --rm -- /bin/sh  # Interactive pod (auto-delete)
kubectl get pods -o wide --show-labels         # Detailed pod info with labels
kubectl get pods --field-selector=status.phase=Running  # Filter by status
kubectl get pods --selector=app=nginx          # Filter by labels

# Pod inspection & debugging
kubectl describe pod <pod-name>                # Detailed pod info
kubectl logs <pod-name> -f                     # Follow logs in real-time
kubectl logs <pod-name> -c <container>         # Logs from specific container
kubectl logs <pod-name> --previous             # Logs from crashed container
kubectl exec -it <pod-name> -- /bin/bash       # Shell into pod
kubectl exec -it <pod-name> -c <container> -- /bin/sh  # Shell into specific container

# Pod utilities
kubectl port-forward pod/<pod-name> 8080:80    # Port forward to local machine
kubectl cp file.txt <pod-name>:/tmp/           # Copy file to pod
kubectl cp <pod-name>:/tmp/file.txt ./file.txt # Copy file from pod
```

---

## 🔄 Deployments & ReplicaSets
```bash
# Deployment lifecycle
kubectl create deployment nginx --image=nginx  # Create deployment
kubectl get deployments -o wide                # View deployments with details
kubectl scale deployment nginx --replicas=5    # Scale up/down
kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80  # HPA

# Rolling updates & rollbacks
kubectl set image deployment/nginx nginx=nginx:1.20  # Update image
kubectl rollout status deployment/nginx        # Watch rollout progress
kubectl rollout history deployment/nginx       # View rollout history
kubectl rollout undo deployment/nginx          # Rollback to previous version
kubectl rollout undo deployment/nginx --to-revision=2  # Rollback to specific revision

# Deployment management
kubectl edit deployment nginx                   # Edit deployment in-place
kubectl patch deployment nginx -p '{"spec":{"replicas":3}}'  # Patch specific field
```

---

## 🌐 Services & Networking
```bash
# Service creation
kubectl expose pod nginx --port=80 --target-port=80  # ClusterIP service
kubectl expose deployment nginx --port=80 --type=NodePort    # NodePort service
kubectl expose deployment nginx --port=80 --type=LoadBalancer  # LoadBalancer service

# Service management
kubectl get svc -o wide                        # List services with details
kubectl describe svc nginx                     # Service details & endpoints
kubectl get endpoints                          # View service endpoints

# Network debugging
kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash  # Network debug pod
kubectl exec -it tmp-shell -- nslookup kubernetes.default  # DNS testing
```

---

## 🗂️ ConfigMaps & Secrets
```bash
# ConfigMap operations
kubectl create configmap app-config --from-literal=key1=value1 --from-literal=key2=value2
kubectl create configmap app-config --from-file=config.properties  # From file
kubectl create configmap app-config --from-env-file=.env  # From env file
kubectl get configmap app-config -o yaml       # View ConfigMap content

# Secret operations  
kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=secret123
kubectl create secret docker-registry regcred --docker-server=myregistry.com --docker-username=user --docker-password=pass
kubectl create secret tls tls-secret --cert=path/to/cert --key=path/to/key  # TLS secret
kubectl get secrets -o yaml                    # View all secrets (base64 encoded)

# Using in pods (remember these patterns)
# env:
# - name: DB_USER
#   valueFrom:
#     secretKeyRef: {name: db-secret, key: username}
# volumeMounts:
# - name: config-volume
#   mountPath: /etc/config
```

---

## 🏠 Namespace Management
```bash
kubectl get namespaces                         # List all namespaces
kubectl create namespace development           # Create namespace
kubectl delete namespace development           # Delete namespace (careful!)

# Working across namespaces
kubectl get pods -A                           # All pods in all namespaces
kubectl get pods -n kube-system               # Pods in specific namespace
kubectl config set-context --current --namespace=development  # Set default namespace

# Resource quotas (important for CKA)
kubectl create quota dev-quota --hard=pods=10,secrets=5 -n development
kubectl describe quota -n development         # View quota usage
```

---

## ⏰ Jobs & CronJobs
```bash
# Job creation
kubectl create job pi-calc --image=perl -- perl -Mbignum=bpi -wle 'print bpi(2000)'
kubectl create job backup --image=busybox -- /bin/sh -c 'tar czf /backup.tar.gz /data'

# CronJob creation  
kubectl create cronjob backup --schedule="0 2 * * *" --image=busybox -- /bin/sh -c 'backup command'
kubectl create cronjob cleanup --schedule="*/30 * * * *" --image=busybox -- /bin/sh -c 'cleanup'

# Job management
kubectl get jobs                               # View jobs
kubectl describe job pi-calc                  # Job details
kubectl logs job/pi-calc                      # Job logs
kubectl delete job pi-calc                    # Clean up completed job
```

---

## 💾 Persistent Volumes & Claims
```bash
# PV & PVC operations
kubectl get pv,pvc                            # View volumes and claims
kubectl describe pv <pv-name>                 # PV details
kubectl describe pvc <pvc-name>               # PVC details and binding status

# Quick PVC creation (memorize this pattern)
kubectl create -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes: ["ReadWriteOnce"]              # RWO, RWX, ROX
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard                  # Optional: specify storage class
EOF
```

---

## 🔐 RBAC & Security
```bash
# View RBAC resources
kubectl get roles,rolebindings -A             # All roles and bindings
kubectl get clusterroles,clusterrolebindings  # Cluster-wide permissions
kubectl get sa                                # Service accounts

# Create RBAC resources
kubectl create role pod-reader --verb=get,list,watch --resource=pods
kubectl create clusterrole node-reader --verb=get,list --resource=nodes
kubectl create rolebinding pod-reader-binding --role=pod-reader --user=jane
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=admin

# Permission testing (very useful!)
kubectl auth can-i create pods                # Test your permissions
kubectl auth can-i create pods --as=system:serviceaccount:default:my-sa  # Test as service account
kubectl auth can-i '*' '*' --as=system:serviceaccount:kube-system:default  # Test wildcard permissions
```

---

## 🛡️ Network Policies
```bash
# Get network policies
kubectl get networkpolicies -A               # View all network policies
kubectl describe networkpolicy <policy-name> # Policy details

# Common NetworkPolicy patterns (know these!)
# Deny all ingress traffic
kubectl create -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}                             # Applies to all pods
  policyTypes: ["Ingress"]
EOF

# Allow specific ingress
kubectl create -f - <<EOF  
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes: ["Ingress"]
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - port: 8080
EOF
```

---

## 🏥 Cluster Maintenance & Troubleshooting
```bash
# Node management
kubectl get nodes -o wide                     # Node status and info
kubectl describe node <node-name>             # Detailed node info
kubectl cordon <node-name>                    # Mark node unschedulable
kubectl drain <node-name> --ignore-daemonsets --force  # Evict pods from node
kubectl uncordon <node-name>                  # Mark node schedulable again

# Cluster health
kubectl get componentstatuses                 # Check cluster components (deprecated but useful)
kubectl cluster-info                          # Basic cluster info
kubectl cluster-info dump                     # Detailed cluster dump
kubectl get events --sort-by=.metadata.creationTimestamp  # Recent cluster events

# Resource monitoring
kubectl top nodes                             # Node resource usage (requires metrics-server)
kubectl top pods -A                           # Pod resource usage across all namespaces
kubectl top pods --containers                 # Container-level resource usage
```

---

## 💾 ETCD Backup & Restore (Critical!)
```bash
# ETCD backup (memorize this!)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot-$(date +%Y%m%d-%H%M%S).db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db

# ETCD restore (practice this!)
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore \
  --name=master \
  --initial-cluster=master=https://127.0.0.1:2380 \
  --initial-advertise-peer-urls=https://127.0.0.1:2380

# Remember to update /etc/kubernetes/manifests/etcd.yaml with new data-dir
# and restart kubelet: systemctl restart kubelet
```

---

## 🔧 Advanced Debugging & Utilities
```bash
# Advanced pod filtering
kubectl get pods --field-selector=status.phase=Failed        # Failed pods only
kubectl get pods --field-selector=spec.nodeName=worker-1     # Pods on specific node
kubectl get pods --selector=environment!=production          # Exclude production pods

# Resource manipulation
kubectl patch pod nginx -p '{"metadata":{"labels":{"env":"prod"}}}'  # Add label
kubectl annotate pod nginx description="My nginx pod"        # Add annotation
kubectl label pod nginx env=production                       # Add label (alternative)

# JSON path queries (advanced but powerful)
kubectl get pods -o jsonpath='{.items[*].metadata.name}'     # Get all pod names
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'  # Get all images
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'  # Node IPs

# Quick YAML generation (exam time-savers)
kubectl create deployment nginx --image=nginx $do > deploy.yaml      # Generate deployment YAML
kubectl create service clusterip nginx --tcp=80:80 $do > svc.yaml    # Generate service YAML
kubectl create job backup --image=busybox $do -- /bin/sh -c 'echo backup' > job.yaml

# Temporary debugging pods
kubectl run debug-pod --image=busybox -it --rm -- /bin/sh    # Temporary debug pod
kubectl run netshoot --image=nicolaka/netshoot -it --rm -- /bin/bash  # Network debugging
kubectl run curl --image=curlimages/curl -it --rm -- /bin/sh # HTTP debugging
```

---

## 🎯 Exam-Specific Tips & Tricks

### Time-Saving Commands
```bash
# Use these frequently during exam
kubectl api-resources                          # List all resource types and shortcuts
kubectl explain pod.spec.containers           # Get field documentation
kubectl explain deployment --recursive | grep -i volume  # Search for specific fields

# Quick resource creation without YAML files
kubectl create deployment nginx --image=nginx --port=80 --replicas=3
kubectl expose deployment nginx --type=NodePort --port=80
kubectl create configmap app-config --from-literal=env=prod --from-literal=debug=false
```

### Common Exam Patterns
```bash
# Multi-container pod (sidecar pattern)
kubectl run webapp --image=nginx --dry-run=client -o yaml > webapp.yaml
# Then edit to add second container manually

# Init container pattern  
kubectl run myapp --image=busybox --dry-run=client -o yaml > myapp.yaml
# Add initContainers section manually

# Resource limits and requests
kubectl run limited-pod --image=nginx --requests='cpu=100m,memory=128Mi' --limits='cpu=200m,memory=256Mi' --dry-run=client -o yaml > limited.yaml
```

### Must-Know Shortcuts
- `po` = pods
- `svc` = services  
- `ns` = namespaces
- `deploy` = deployments
- `rs` = replicasets
- `ds` = daemonsets
- `sts` = statefulsets
- `cm` = configmaps
- `pv` = persistentvolumes
- `pvc` = persistentvolumeclaims
- `sa` = serviceaccounts

### Final Exam Checklist
- [ ] Set up aliases immediately
- [ ] Practice ETCD backup/restore until muscle memory
- [ ] Know YAML generation with `--dry-run=client -o yaml`
- [ ] Master `kubectl explain` for field documentation
- [ ] Practice NetworkPolicy creation from memory
- [ ] Understand RBAC role vs clusterrole differences
- [ ] Know how to troubleshoot failed pods with `describe` and `logs`
- [ ] Practice node maintenance (cordon/drain/uncordon)

---

**🏆 Remember**: Speed comes from practice, not just knowing commands. Practice these scenarios until they become automatic!>)](<# 🎯 Complete CKA `kubectl` Cheat Sheet

## 🚀 Essential Setup & Aliases
```bash
# Must-have aliases (add to ~/.bashrc in exam)
alias k=kubectl
alias kgp='kubectl get pods'
alias kgs='kubectl get svc' 
alias kgd='kubectl get deployments'
alias kgn='kubectl get nodes'
export do='--dry-run=client -o yaml'    # Super useful: k create deploy nginx --image=nginx $do
export now='--force --grace-period=0'   # Force delete: k delete pod nginx $now

# Quick context switching
kubectl config get-contexts                    # List all contexts
kubectl config use-context %3Ccontext-name%3E      # Switch context
kubectl config set-context --current --namespace=<ns>  # Set default namespace
```

---

## 📦 Pod Management
```bash
# Basic pod operations
kubectl run nginx --image=nginx                # Create single pod
kubectl run busybox --image=busybox -it --rm -- /bin/sh  # Interactive pod (auto-delete)
kubectl get pods -o wide --show-labels         # Detailed pod info with labels
kubectl get pods --field-selector=status.phase=Running  # Filter by status
kubectl get pods --selector=app=nginx          # Filter by labels

# Pod inspection & debugging
kubectl describe pod <pod-name>                # Detailed pod info
kubectl logs <pod-name> -f                     # Follow logs in real-time
kubectl logs <pod-name> -c <container>         # Logs from specific container
kubectl logs <pod-name> --previous             # Logs from crashed container
kubectl exec -it <pod-name> -- /bin/bash       # Shell into pod
kubectl exec -it <pod-name> -c <container> -- /bin/sh  # Shell into specific container

# Pod utilities
kubectl port-forward pod/<pod-name> 8080:80    # Port forward to local machine
kubectl cp file.txt <pod-name>:/tmp/           # Copy file to pod
kubectl cp <pod-name>:/tmp/file.txt ./file.txt # Copy file from pod
```

---

## 🔄 Deployments & ReplicaSets
```bash
# Deployment lifecycle
kubectl create deployment nginx --image=nginx  # Create deployment
kubectl get deployments -o wide                # View deployments with details
kubectl scale deployment nginx --replicas=5    # Scale up/down
kubectl autoscale deployment nginx --min=2 --max=10 --cpu-percent=80  # HPA

# Rolling updates & rollbacks
kubectl set image deployment/nginx nginx=nginx:1.20  # Update image
kubectl rollout status deployment/nginx        # Watch rollout progress
kubectl rollout history deployment/nginx       # View rollout history
kubectl rollout undo deployment/nginx          # Rollback to previous version
kubectl rollout undo deployment/nginx --to-revision=2  # Rollback to specific revision

# Deployment management
kubectl edit deployment nginx                   # Edit deployment in-place
kubectl patch deployment nginx -p '{"spec":{"replicas":3}}'  # Patch specific field
```

---

## 🌐 Services & Networking
```bash
# Service creation
kubectl expose pod nginx --port=80 --target-port=80  # ClusterIP service
kubectl expose deployment nginx --port=80 --type=NodePort    # NodePort service
kubectl expose deployment nginx --port=80 --type=LoadBalancer  # LoadBalancer service

# Service management
kubectl get svc -o wide                        # List services with details
kubectl describe svc nginx                     # Service details & endpoints
kubectl get endpoints                          # View service endpoints

# Network debugging
kubectl run tmp-shell --rm -i --tty --image nicolaka/netshoot -- /bin/bash  # Network debug pod
kubectl exec -it tmp-shell -- nslookup kubernetes.default  # DNS testing
```

---

## 🗂️ ConfigMaps & Secrets
```bash
# ConfigMap operations
kubectl create configmap app-config --from-literal=key1=value1 --from-literal=key2=value2
kubectl create configmap app-config --from-file=config.properties  # From file
kubectl create configmap app-config --from-env-file=.env  # From env file
kubectl get configmap app-config -o yaml       # View ConfigMap content

# Secret operations  
kubectl create secret generic db-secret --from-literal=username=admin --from-literal=password=secret123
kubectl create secret docker-registry regcred --docker-server=myregistry.com --docker-username=user --docker-password=pass
kubectl create secret tls tls-secret --cert=path/to/cert --key=path/to/key  # TLS secret
kubectl get secrets -o yaml                    # View all secrets (base64 encoded)

# Using in pods (remember these patterns)
# env:
# - name: DB_USER
#   valueFrom:
#     secretKeyRef: {name: db-secret, key: username}
# volumeMounts:
# - name: config-volume
#   mountPath: /etc/config
```

---

## 🏠 Namespace Management
```bash
kubectl get namespaces                         # List all namespaces
kubectl create namespace development           # Create namespace
kubectl delete namespace development           # Delete namespace (careful!)

# Working across namespaces
kubectl get pods -A                           # All pods in all namespaces
kubectl get pods -n kube-system               # Pods in specific namespace
kubectl config set-context --current --namespace=development  # Set default namespace

# Resource quotas (important for CKA)
kubectl create quota dev-quota --hard=pods=10,secrets=5 -n development
kubectl describe quota -n development         # View quota usage
```

---

## ⏰ Jobs & CronJobs
```bash
# Job creation
kubectl create job pi-calc --image=perl -- perl -Mbignum=bpi -wle 'print bpi(2000)'
kubectl create job backup --image=busybox -- /bin/sh -c 'tar czf /backup.tar.gz /data'

# CronJob creation  
kubectl create cronjob backup --schedule="0 2 * * *" --image=busybox -- /bin/sh -c 'backup command'
kubectl create cronjob cleanup --schedule="*/30 * * * *" --image=busybox -- /bin/sh -c 'cleanup'

# Job management
kubectl get jobs                               # View jobs
kubectl describe job pi-calc                  # Job details
kubectl logs job/pi-calc                      # Job logs
kubectl delete job pi-calc                    # Clean up completed job
```

---

## 💾 Persistent Volumes & Claims
```bash
# PV & PVC operations
kubectl get pv,pvc                            # View volumes and claims
kubectl describe pv <pv-name>                 # PV details
kubectl describe pvc <pvc-name>               # PVC details and binding status

# Quick PVC creation (memorize this pattern)
kubectl create -f - <<EOF
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: my-pvc
spec:
  accessModes: ["ReadWriteOnce"]              # RWO, RWX, ROX
  resources:
    requests:
      storage: 1Gi
  storageClassName: standard                  # Optional: specify storage class
EOF
```

---

## 🔐 RBAC & Security
```bash
# View RBAC resources
kubectl get roles,rolebindings -A             # All roles and bindings
kubectl get clusterroles,clusterrolebindings  # Cluster-wide permissions
kubectl get sa                                # Service accounts

# Create RBAC resources
kubectl create role pod-reader --verb=get,list,watch --resource=pods
kubectl create clusterrole node-reader --verb=get,list --resource=nodes
kubectl create rolebinding pod-reader-binding --role=pod-reader --user=jane
kubectl create clusterrolebinding cluster-admin-binding --clusterrole=cluster-admin --user=admin

# Permission testing (very useful!)
kubectl auth can-i create pods                # Test your permissions
kubectl auth can-i create pods --as=system:serviceaccount:default:my-sa  # Test as service account
kubectl auth can-i '*' '*' --as=system:serviceaccount:kube-system:default  # Test wildcard permissions
```

---

## 🛡️ Network Policies
```bash
# Get network policies
kubectl get networkpolicies -A               # View all network policies
kubectl describe networkpolicy <policy-name> # Policy details

# Common NetworkPolicy patterns (know these!)
# Deny all ingress traffic
kubectl create -f - <<EOF
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all
spec:
  podSelector: {}                             # Applies to all pods
  policyTypes: ["Ingress"]
EOF

# Allow specific ingress
kubectl create -f - <<EOF  
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes: ["Ingress"]
  ingress:
  - from:
    - podSelector:
        matchLabels:
          app: frontend
    ports:
    - port: 8080
EOF
```

---

## 🏥 Cluster Maintenance & Troubleshooting
```bash
# Node management
kubectl get nodes -o wide                     # Node status and info
kubectl describe node <node-name>             # Detailed node info
kubectl cordon <node-name>                    # Mark node unschedulable
kubectl drain <node-name> --ignore-daemonsets --force  # Evict pods from node
kubectl uncordon <node-name>                  # Mark node schedulable again

# Cluster health
kubectl get componentstatuses                 # Check cluster components (deprecated but useful)
kubectl cluster-info                          # Basic cluster info
kubectl cluster-info dump                     # Detailed cluster dump
kubectl get events --sort-by=.metadata.creationTimestamp  # Recent cluster events

# Resource monitoring
kubectl top nodes                             # Node resource usage (requires metrics-server)
kubectl top pods -A                           # Pod resource usage across all namespaces
kubectl top pods --containers                 # Container-level resource usage
```

---

## 💾 ETCD Backup & Restore (Critical!)
```bash
# ETCD backup (memorize this!)
ETCDCTL_API=3 etcdctl snapshot save /backup/etcd-snapshot-$(date +%Y%m%d-%H%M%S).db \
  --endpoints=https://127.0.0.1:2379 \
  --cacert=/etc/kubernetes/pki/etcd/ca.crt \
  --cert=/etc/kubernetes/pki/etcd/server.crt \
  --key=/etc/kubernetes/pki/etcd/server.key

# Verify backup
ETCDCTL_API=3 etcdctl snapshot status /backup/etcd-snapshot.db

# ETCD restore (practice this!)
ETCDCTL_API=3 etcdctl snapshot restore /backup/etcd-snapshot.db \
  --data-dir=/var/lib/etcd-restore \
  --name=master \
  --initial-cluster=master=https://127.0.0.1:2380 \
  --initial-advertise-peer-urls=https://127.0.0.1:2380

# Remember to update /etc/kubernetes/manifests/etcd.yaml with new data-dir
# and restart kubelet: systemctl restart kubelet
```

---

## 🔧 Advanced Debugging & Utilities
```bash
# Advanced pod filtering
kubectl get pods --field-selector=status.phase=Failed        # Failed pods only
kubectl get pods --field-selector=spec.nodeName=worker-1     # Pods on specific node
kubectl get pods --selector=environment!=production          # Exclude production pods

# Resource manipulation
kubectl patch pod nginx -p '{"metadata":{"labels":{"env":"prod"}}}'  # Add label
kubectl annotate pod nginx description="My nginx pod"        # Add annotation
kubectl label pod nginx env=production                       # Add label (alternative)

# JSON path queries (advanced but powerful)
kubectl get pods -o jsonpath='{.items[*].metadata.name}'     # Get all pod names
kubectl get pods -o jsonpath='{.items[*].spec.containers[*].image}'  # Get all images
kubectl get nodes -o jsonpath='{.items[*].status.addresses[?(@.type=="InternalIP")].address}'  # Node IPs

# Quick YAML generation (exam time-savers)
kubectl create deployment nginx --image=nginx $do > deploy.yaml      # Generate deployment YAML
kubectl create service clusterip nginx --tcp=80:80 $do > svc.yaml    # Generate service YAML
kubectl create job backup --image=busybox $do -- /bin/sh -c 'echo backup' > job.yaml

# Temporary debugging pods
kubectl run debug-pod --image=busybox -it --rm -- /bin/sh    # Temporary debug pod
kubectl run netshoot --image=nicolaka/netshoot -it --rm -- /bin/bash  # Network debugging
kubectl run curl --image=curlimages/curl -it --rm -- /bin/sh # HTTP debugging
```

---

## 🎯 Exam-Specific Tips & Tricks

### Time-Saving Commands
```bash
# Use these frequently during exam
kubectl api-resources                          # List all resource types and shortcuts
kubectl explain pod.spec.containers           # Get field documentation
kubectl explain deployment --recursive | grep -i volume  # Search for specific fields

# Quick resource creation without YAML files
kubectl create deployment nginx --image=nginx --port=80 --replicas=3
kubectl expose deployment nginx --type=NodePort --port=80
kubectl create configmap app-config --from-literal=env=prod --from-literal=debug=false
```

### Common Exam Patterns
```bash
# Multi-container pod (sidecar pattern)
kubectl run webapp --image=nginx --dry-run=client -o yaml > webapp.yaml
# Then edit to add second container manually

# Init container pattern  
kubectl run myapp --image=busybox --dry-run=client -o yaml > myapp.yaml
# Add initContainers section manually

# Resource limits and requests
kubectl run limited-pod --image=nginx --requests='cpu=100m,memory=128Mi' --limits='cpu=200m,memory=256Mi' --dry-run=client -o yaml > limited.yaml
```

### Must-Know Shortcuts
- `po` = pods
- `svc` = services  
- `ns` = namespaces
- `deploy` = deployments
- `rs` = replicasets
- `ds` = daemonsets
- `sts` = statefulsets
- `cm` = configmaps
- `pv` = persistentvolumes
- `pvc` = persistentvolumeclaims
- `sa` = serviceaccounts

### Final Exam Checklist
- [ ] Set up aliases immediately
- [ ] Practice ETCD backup/restore until muscle memory
- [ ] Know YAML generation with `--dry-run=client -o yaml`
- [ ] Master `kubectl explain` for field documentation
- [ ] Practice NetworkPolicy creation from memory
- [ ] Understand RBAC role vs clusterrole differences
- [ ] Know how to troubleshoot failed pods with `describe` and `logs`
- [ ] Practice node maintenance (cordon/drain/uncordon)

---

**🏆 Remember**: Speed comes from practice, not just knowing commands. Practice these scenarios until they become automatic!>)