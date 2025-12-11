const e=`---
def-type: consolidated
---
## def-type: consolidated
---
# Kubernetes

_K8s, Container Orchestration_

An open-source platform designed to automate deploying, scaling, and operating containerized applications. Kubernetes (often abbreviated as K8s) handles the complex task of scheduling containers across a cluster of machines, ensuring high availability, and managing updates and rollbacks.

Think of Kubernetes as an operating system for your data center or cloud - it abstracts away the underlying infrastructure and provides a consistent platform for running applications.

Example: Instead of managing individual Docker containers across dozens of servers, a company might use Kubernetes to declare "I need 10 instances of my web application running at all times" and let Kubernetes handle where they run and how they're replaced if they fail.

---

# Pod

_Kubernetes Resource, Basic Unit_

The smallest deployable unit in Kubernetes that represents one or more containers that should be controlled as a single application. Pods are like logical hosts - all containers in a pod share the same network namespace (IP address) and can communicate using localhost.

Think of a pod as a wrapper around one or more tightly-coupled containers that need to work together.

Example: A web application pod might contain both a web server container and a sidecar container that handles logging or monitoring.

---

# Node

_Kubernetes Infrastructure, Worker Machine_

A physical or virtual machine in a Kubernetes cluster that runs containers. Each node contains the services necessary to run pods, including the container runtime (like Docker), kubelet (agent that communicates with the control plane), and kube-proxy (network proxy).

Think of nodes as the servers that make up your Kubernetes cluster - they provide the CPU, memory, and storage resources that your applications use.

Example: A production Kubernetes cluster might have dozens or hundreds of nodes spread across multiple data centers for high availability.

---

# Cluster

_Kubernetes Infrastructure, Computing Group_

A set of nodes that run containerized applications managed by Kubernetes. A cluster consists of at least one control plane and multiple worker nodes. The control plane manages the worker nodes and the pods in the cluster.

Think of a cluster as your entire Kubernetes environment - all the infrastructure needed to run your containerized applications.

Example: A company might have separate Kubernetes clusters for development, staging, and production environments, each with their own control plane and worker nodes.

---

# Namespace

_Kubernetes Organization, Resource Isolation_

A way to divide cluster resources between multiple users, teams, or projects. Namespaces provide a scope for names - names of resources need to be unique within a namespace but not across namespaces.

Think of namespaces like folders that organize your Kubernetes resources and provide some isolation between different applications or teams.

Example: A shared Kubernetes cluster might have a "frontend" namespace for the web team, a "backend" namespace for the API team, and a "monitoring" namespace for observability tools.

---

# Deployment

_Kubernetes Resource, Application Management_

A resource that provides declarative updates for Pods and ReplicaSets. Deployments allow you to describe an application's life cycle, including which images to use, how many pod replicas should run, and how updates should be rolled out.

Think of a Deployment as a blueprint for creating and updating instances of your application.

Example: A Deployment might specify "run 5 replicas of version 1.2 of the user-service container, and update them one at a time when a new version is available."

---

# Service

_Kubernetes Resource, Network Abstraction_

An abstract way to expose an application running on a set of Pods as a network service. Services provide a stable IP address and DNS name for a set of pods, along with load balancing.

Think of a Service as a virtual load balancer and DNS entry that directs traffic to the right pods, even as they come and go due to scaling or failures.

Example: A Service named "database" might load-balance connections to several database pods, allowing application pods to simply connect to "database" without knowing the specific pod IPs.

---

# Ingress

_Kubernetes Resource, External Access_

A resource that manages external access to services within a cluster, typically HTTP. Ingress provides load balancing, SSL termination, and name-based virtual hosting.

Think of Ingress as the entry point for external traffic coming into your Kubernetes cluster - like a smart router for HTTP and HTTPS traffic.

Example: An Ingress might route requests to "example.com/api" to the API service and "example.com/app" to the web application service.

---

# ConfigMap

_Kubernetes Resource, Configuration Storage_

A resource for injecting configuration data into pods. ConfigMaps allow you to decouple configuration from container images, so you can change configuration without rebuilding your application container.

Think of ConfigMaps as a way to provide configuration files, command-line arguments, or environment variables to your containers.

Example: A ConfigMap might contain database connection strings, feature flags, or logging levels that can be updated without redeploying the application.

---

# Secret

_Kubernetes Resource, Sensitive Data_

A resource specifically designed for storing sensitive information such as passwords, OAuth tokens, SSH keys, and other data that shouldn't be stored in plain text. Secrets are similar to ConfigMaps but with additional security features.

Think of Secrets as a way to provide sensitive configuration to your applications without exposing it in your container images or pod definitions.

Example: Database passwords, API tokens, and TLS certificates would typically be stored in Secrets rather than ConfigMaps.

---

# PersistentVolume

_Kubernetes Resource, Storage Abstraction_

A piece of storage in the cluster that has been provisioned by an administrator or dynamically provisioned using Storage Classes. PersistentVolumes are cluster resources that exist independently of any individual pod.

Think of PersistentVolumes as abstracted storage devices (like virtual hard drives) that pods can claim and use.

Example: A database pod might claim a PersistentVolume to store its data files, ensuring the data persists even if the pod is rescheduled to a different node.

---

# StatefulSet

_Kubernetes Resource, Stateful Application_

A workload API object used to manage stateful applications. Unlike Deployments, StatefulSets maintain a sticky identity for each pod, with stable, unique network identifiers and persistent storage.

Think of StatefulSets as a way to run applications that need stable network identities and persistent storage, like databases.

Example: A MongoDB replica set might be deployed as a StatefulSet so that each instance has a predictable hostname (mongo-0, mongo-1, mongo-2) and its own persistent storage.

---

# DaemonSet

_Kubernetes Resource, Node-level Service_

Ensures that all (or some) nodes run a copy of a pod. As nodes are added to the cluster, pods are added to them. As nodes are removed, those pods are garbage collected.

Think of DaemonSets as a way to run a pod on every node - useful for node-level monitoring, logging, or networking components.

Example: A log collection daemon or node monitoring agent might be deployed as a DaemonSet to ensure it runs on every node in the cluster.

---

# Job

_Kubernetes Resource, Batch Processing_

A resource that creates one or more pods and ensures that a specified number of them successfully complete. Jobs are used for batch processing or one-time tasks.

Think of Jobs as a way to run tasks that should run to completion rather than continuously.

Example: A data processing task, database migration, or one-time initialization script might be run as a Job.

---

# CronJob

_Kubernetes Resource, Scheduled Task_

A resource that creates Jobs on a repeating schedule, similar to cron jobs in Linux. CronJobs are useful for scheduled tasks like backups, report generation, or periodic maintenance.

Example: A CronJob might be set up to run a database backup every night at 2 AM, or to send a weekly analytics report every Monday morning.

---

# CustomResourceDefinition

_CRD, Kubernetes Extension_

A resource that extends the Kubernetes API with custom resources. CRDs allow you to define your own resource types that Kubernetes will understand and manage.

Think of CRDs as a way to teach Kubernetes about new types of resources specific to your applications or organization.

Example: A database operator might define a "Database" CRD, allowing users to create database instances by creating Kubernetes resources instead of manually setting up StatefulSets, Services, and ConfigMaps.

---

# Controller

_Kubernetes Component, Control Loop_

A control loop that watches the state of your cluster and makes changes to move the current state towards the desired state. Different controllers manage different aspects of the cluster.

Think of controllers as the components that implement Kubernetes' self-healing capabilities, constantly working to make reality match your specifications.

Example: The Deployment controller ensures that the right number of pod replicas are running, while the Node controller monitors nodes and responds when they go down.

---

# Kubelet

_Kubernetes Component, Node Agent_

An agent that runs on each node in the cluster and ensures that containers are running in a pod. The kubelet takes a set of PodSpecs and ensures that the containers described in those PodSpecs are running and healthy.

Think of kubelet as the Kubernetes representative on each node, responsible for managing the containers on that node.

Example: When you create a new pod, the control plane assigns it to a node, and the kubelet on that node is responsible for creating and monitoring the containers for that pod.

---

# Kube-proxy

_Kubernetes Component, Network Proxy_

A network proxy that runs on each node in the cluster, implementing part of the Kubernetes Service concept. kube-proxy maintains network rules (using iptables or IPVS) that allow network communication to pods from inside or outside the cluster.

Think of kube-proxy as the component that enables the networking magic of Kubernetes Services.

Example: When you connect to a Kubernetes Service, kube-proxy routes your connection to one of the healthy pods behind that Service.

---

# etcd

_Kubernetes Component, Distributed Database_

A consistent and highly-available key-value store used as Kubernetes' backing store for all cluster data. All Kubernetes objects (like pods, services, etc.) are stored in etcd.

Think of etcd as the database that holds the state of your entire Kubernetes cluster - the source of truth for what should be running and how.

Example: When you create a deployment, the information about that deployment is stored in etcd, and controllers watch etcd for changes to react to.

---

# kubectl

_Kubernetes CLI, Command-line Tool_

The main command-line tool for interacting with a Kubernetes cluster. kubectl allows you to inspect, create, update, and delete Kubernetes resources.

Think of kubectl as your primary interface for controlling Kubernetes - like a remote control for your cluster.

Example: Commands like \`kubectl get pods\`, \`kubectl apply -f deployment.yaml\`, or \`kubectl logs my-pod\` allow you to manage and inspect your applications running in Kubernetes.

---

# Helm

_Kubernetes Package Manager, Application Deployment_

A package manager for Kubernetes that helps you define, install, and upgrade complex Kubernetes applications. Helm uses "charts" - packages of pre-configured Kubernetes resources - to simplify deployment of common applications.

Think of Helm like apt, yum, or brew, but for Kubernetes applications - it helps you install and manage software on your cluster.

Example: Instead of manually creating dozens of Kubernetes resources to deploy a monitoring stack, you might use a Helm command like \`helm install prometheus prometheus-community/prometheus\` to deploy everything needed with sensible defaults.

---

# Chart

_Helm Component, Package Definition_

A package of pre-configured Kubernetes resources that can be deployed together. Helm charts contain templates, default values, and documentation for deploying applications on Kubernetes.

Think of charts as recipes for deploying specific types of applications on Kubernetes.

Example: The "MySQL" chart might contain templates for a StatefulSet, Service, ConfigMap, and Secret needed to run MySQL on Kubernetes, along with configuration options.

---

# Operator

_Kubernetes Extension, Application Manager_

A software extension to Kubernetes that makes use of custom resources to manage applications and their components. Operators follow Kubernetes principles, particularly the control loop pattern, to automate complex application management tasks.

Think of Operators as application-specific controllers that know how to manage a particular type of software, like a database or monitoring system.

Example: A PostgreSQL operator might know how to deploy clusters, handle failover, manage backups, and perform version upgrades - tasks that would otherwise require manual intervention.

---

# Horizontal Pod Autoscaler

_HPA, Kubernetes Autoscaling_

A resource that automatically scales the number of pod replicas based on observed metrics like CPU utilization or memory usage. HPA helps ensure your application has enough resources to handle varying loads.

Example: An HPA might be configured to maintain CPU utilization at around 50% by adding more pod replicas when utilization increases and removing them when it decreases.

---

# Readiness Probe

_Kubernetes Health Check, Availability Check_

A diagnostic check that determines when a container is ready to accept traffic. Kubernetes doesn't send traffic to a pod until all of its containers have passed their readiness probes.

Example: A web application might have a readiness probe that checks if it can connect to its database and has finished initializing before it starts receiving user requests.

---

# Liveness Probe

_Kubernetes Health Check, Health Monitoring_

A diagnostic check that determines if a container is running properly. If a container fails its liveness probe, Kubernetes will restart it.

Example: An application might have a liveness probe that checks if it's still responsive, automatically restarting it if it becomes deadlocked or otherwise unresponsive.`;export{e as default};
