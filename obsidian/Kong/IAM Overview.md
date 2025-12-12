
## tags: [sonic, devops, infrastructure, IAM, kubernetes, helm, ansible] aliases: [sonic infrastructure, IAM deployment, sonic networks]

# 🧠 Sonic Healthcare DevOps Overview

---
## 🔐 InterSystems API Manager (IAM)

**Purpose:** Sonic uses InterSystems API Manager (IAM) for routing and securing API traffic within Kubernetes environments using Kong Gateway. Each IAM instance is tied to a specific application (like QXR, ABC, etc.).

> **Q: Why do we deploy one IAM per project (e.g., QXR, ABC)?**

**A: To ensure strong network isolation and security via firewall and Kubernetes Network Policies.**

- Each IAM is isolated within a namespace and only allowed to connect to specific IRIS backends.
- This separation allows firewall rules and egress policies to restrict traffic precisely.
- It supports secure deployments in both internal and DMZ networks.
- Easier auditing and policy control per project.
    
### IAM Deployment Details

- **Deployed using:** Kong Enterprise Helm chart
    
- **Custom environment variable:** `ISC_IRIS_URL` is added to templates/_helpers.tpl
    
- **Helm Chart Location:** `oci://harbor-int.au.int.sonichealthcare/intersystems/helm-charts/kong`

#### Helm Deployment Command:

```sh
helm upgrade iam-dp-qxr oci://harbor-int.au.int.sonichealthcare/intersystems/helm-charts/kong \
  --version 2.39.3 -f values-iam-dp-qxr.yml
```

---

## 🌐 Network Layout

Sonic maintains Kubernetes clusters across four primary locations:

|Location|Description|
|---|---|
|BNE|Internal network in Brisbane|
|BNE-DMZ|DMZ (externally exposed) in Brisbane|
|SYD|Internal network in Sydney|
|SYD-DMZ|DMZ (externally exposed) in Sydney|

> IAM instances may be deployed to any of these locations depending on application requirements.

DMZ clusters serve applications needing limited exposure to the internet or external partners, while internal clusters are for secure, internal operations.

---

## 🧪 Environments (DEV, QC, UAT, PROD)

|Environment|Purpose|
|---|---|
|DEV|Active development/testing environment by developers.|
|QC|Quality control/testing, often paired with DEV.|
|UAT|User Acceptance Testing, often with production-like data.|
|PROD|Production system serving real users/data.|
|PRE-PROD|Often means DEV + QC together, used for pre-live checks.|

Developers might say “this is pre-prod only” to mean it won’t go into UAT/PROD yet.

---

## ⚙️ Automation: Ansible & Pipelines

### Setup Env Pipeline

- Applies pull secrets for IAM container images.
    
- Applies IRIS license secrets.
    
- Applies Kong license secret.
    
- Defined in: `azure-devops/setup-env.yaml`
    
- Playbook: `ansible/playbooks/setup-env-tanzu.yaml`
    

### Build and Release Pipelines

- **Build Pipeline:** uses common Helm values template.
    
- **Release Pipeline:** only `release/*` branches can go to production.
    
- Post-install tasks include applying network policies via: `ansible/tasks/apply-netpol.yaml`
    

---

## 🧱 Supporting Concepts

### What is a DMZ?

> A **Demilitarized Zone (DMZ)** is a network segment that exposes external-facing services to untrusted networks (like the internet) while isolating the internal network.

### What is a Helm Chart?

> A Helm chart is a template for Kubernetes deployments. It allows packaging applications and deploying them in a repeatable, configurable way.

### What is DNS?

> DNS (Domain Name System) resolves human-friendly domain names (e.g., `api.sonic.com`) to machine-readable IP addresses.

### What is Ingress?

> In Kubernetes, **Ingress** is a set of rules that allows external HTTP/S traffic to reach services inside the cluster.

---

## 🔐 IAM (General Definition)

> **IAM = Identity and Access Management** In Sonic’s case, it refers to a secured API Gateway layer (using Kong) that is customized for each entity/project to ensure isolation and network compliance.

IAM ensures each service can only talk to the backend systems it is authorized for and in the right environments.

---

Let me know if you want a visual network diagram or a folder structure suggestion next!