const e=`---
def-type: consolidated
---
---
# Kong

Kong is like a **supercharged NGINX** made for APIs. It **sits in front of your microservices**, and offers:

- 🔐 **Authentication**
    
- 📊 **Rate limiting**
    
- 📈 **Analytics & monitoring**
    
- 🧩 **Plugins** for logging, transforming requests, etc.
    
- 📦 **Service discovery** (when services scale up/down dynamically)
    

**Under the hood, Kong uses NGINX**, but adds **tons of API management features** on top. In a concert venue, if NGINX is ticket booth, Kong is concierge + security gate.

---
# Kong Gateway

_API Gateway, Microservices Gateway_

An open-source API gateway that acts as a middleware layer between clients and your API services. Kong routes client requests to the appropriate services, while providing features like authentication, rate limiting, transformations, logging, and monitoring.

Think of Kong as a smart traffic controller for your APIs - it receives all incoming API requests, processes them according to your configured rules, and routes them to the right backend services.

Example: A company with dozens of microservices might use Kong to provide a single entry point for all API requests, handling authentication and rate limiting in one place instead of implementing these features in each microservice.

---

# Data Plane

_Traffic Processing, Request Handling_

The component in Kong that processes and routes actual API traffic. It's responsible for handling client requests, applying plugins (like authentication or rate limiting), and forwarding requests to backend services.

In a Kong deployment, the Data Plane is the part that directly interacts with API consumers and upstream services, executing the rules defined in the Control Plane.

Think of the Data Plane as the highway where traffic actually flows.

Example: When a mobile app makes an API request, it hits Kong's Data Plane, which might authenticate the request, check rate limits, transform the request if needed, and then route it to the appropriate microservice.

---

# Control Plane

_Management Layer, Configuration_

The component in Kong that handles administrative functions like storing configurations, managing services, routes, and plugins. It's where administrators define how the Data Plane should process API traffic.

In a distributed Kong deployment, changes made in the Control Plane (like adding a new API route) are propagated to all Data Plane nodes.

Think of the Control Plane as the traffic control center that decides the rules for how traffic should flow.

Example: An API team would use the Control Plane (via Kong Manager or the Admin API) to define which routes should be protected with authentication, which should have rate limiting applied, and how requests should be routed to backend services.

---

# Kong Manager

_Administration UI, Enterprise Dashboard_

The graphical user interface included with Kong Enterprise that allows administrators to configure and monitor the Kong gateway. It provides a user-friendly way to manage services, routes, consumers, and plugins without having to use the Admin API directly.

Think of it as the dashboard for controlling all aspects of Kong's behavior.

Example: Instead of writing curl commands or using API clients to configure Kong, administrators can use Kong Manager to create new API routes, apply plugins, and monitor traffic through a web interface.

---

# Kong Admin API

_Configuration API, Management API_

A RESTful API that allows programmatic configuration of Kong. Everything you can do in Kong Manager can also be done through the Admin API, making it ideal for automation, scripts, and integration with CI/CD pipelines.

Example: A DevOps engineer might create scripts that automatically configure Kong when deploying new services, using the Admin API to create routes, services, and apply necessary plugins.

---

# Service

_Kong Entity, Upstream Service_

In Kong terminology, a Service represents a backend API or microservice that Kong routes traffic to. A Service is essentially a target - the place Kong sends requests after processing them.

Each Service in Kong has a name, a protocol (like http or https), a host (domain name or IP), a port, and a path.

Example: A "user-service" in Kong might point to an internal microservice at \`http://user-service.internal:8080/api\` that handles user-related operations.

---

# Route

_Kong Entity, API Endpoint_

In Kong, a Route defines rules for matching client requests to a specific Service. Routes are associated with Services and determine how client requests are sent to those Services.

Routes can match based on various criteria including:

- Paths (e.g., /api/users)
- Hosts (e.g., api.example.com)
- HTTP methods (GET, POST, etc.)
- Headers

Example: You might create a Route that matches requests to \`/api/users/*\` and sends them to your user-service, while requests to \`/api/products/*\` go to a different product-service.

---

# Consumer

_Kong Entity, API Client_

An entity in Kong that represents an end user, application, or service that consumes your APIs. Consumers are used for authentication, authorization, rate limiting, and other per-user policies.

Think of Consumers as the identities of clients accessing your APIs through Kong.

Example: A mobile app might be represented as a Consumer in Kong, with specific credentials and rate limits assigned to it.

---

# Plugin

_Kong Extension, Middleware_

A piece of middleware that extends Kong's functionality. Plugins can modify the request/response cycle of API traffic, add new features, or integrate with external systems.

Plugins can be applied globally, to specific Services, Routes, or Consumers, allowing for granular control over how they affect API traffic.

Common plugin categories include:

- Authentication (OAuth2, JWT, Key Authentication)
- Security (IP Restriction, Bot Detection)
- Traffic Control (Rate Limiting, Request Termination)
- Transformations (Request/Response Transformer)
- Logging and Monitoring (HTTP Log, StatsD)

Example: The rate limiting plugin could be applied to a specific Route to prevent any single client from overwhelming a service with too many requests.

---

# Workspace

_Kong Enterprise, Resource Organization_

A logical namespace in Kong Enterprise that allows you to segment and organize your Kong resources (Services, Routes, Plugins, etc.). Workspaces help larger organizations separate resources by team, department, or environment.

Think of Workspaces as folders that group related API configurations.

Example: A company might create separate workspaces for "Internal APIs," "Partner APIs," and "Public APIs," each managed by different teams with different policies.

---


# Team

_Kong Enterprise, User Group_

A feature in Kong Enterprise that allows grouping of administrators and developers with specific roles and permissions. Teams are part of Kong's Role-Based Access Control (RBAC) system.

Example: The "Partner API Team" might have permissions to manage resources in the "Partner APIs" workspace but not in other workspaces.

---

# RBAC

_Role-Based Access Control, Access Management_

A security approach in Kong Enterprise that restricts system access based on the roles assigned to users. RBAC in Kong allows organizations to control who can view, create, edit, or delete various Kong resources.

Example: A junior developer might be given a role that allows viewing configurations but not modifying them, while a senior API architect might have full admin privileges for certain workspaces.

---

# decK

_Kong CLI, Configuration Management Tool_

A command-line tool for declaratively configuring Kong. decK allows you to define your Kong configuration as YAML files, which can be version-controlled and deployed consistently across environments.

Think of it as "Infrastructure as Code" but for your API gateway configuration.

Example: An organization might maintain their Kong configuration in a Git repository, with CI/CD pipelines using decK to automatically apply changes to development, staging, and production environments.

---

# Hybrid Mode

_Kong Deployment, Control Plane/Data Plane Separation_

A deployment pattern in Kong where the Control Plane (management) and Data Plane (traffic processing) are separated. In Hybrid Mode, a central Control Plane manages configurations while multiple Data Planes in different locations handle the actual API traffic.

This separation provides benefits like:

- Improved security (Admin API only exposed on Control Plane)
- Better performance (Data Planes focused solely on processing requests)
- Simplified operations (centralized management of distributed g`;export{e as default};
