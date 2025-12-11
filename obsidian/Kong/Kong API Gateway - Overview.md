## Resources

- [Github Repo for KONG Training](https://github.com/grongierisc/kong-ee-training?tab=readme-ov-file#1-intersystems-api-manager-training)

> [!note] Related Notes
> 
> - [[../Glossary/API Glossary|API Glossary]] - Comprehensive glossary of API terms
> - [[Kong Academy]] - Structured learning modules from Kong Academy

## What is Kong?

Kong is an open-source API gateway, a software that acts as a central point for managing and routing requests to APIs. It provides tools for authentication, security, traffic control, and monitoring.

## Kong Products

- **Kong Gateway:** An open-source API gateway
- **Kong Enterprise:** An API platform built on top of Kong Gateway
- **Kong Konnect:** A service connectivity platform
- **Kuma:** An open-source service mesh
- **Kong Mesh:** An enterprise-grade service mesh built on top of Kuma
- **Insomnia:** An open-source API design and testing tool

## Kong Gateway Architecture

Kong Gateway is an API Gateway solution built as a Lua application. It operates within nginx, utilizing workers to provide its feature set. The typical architecture flow is:

Client Request → Kong API Gateway → Backend Services (Kubernetes, etc.)

## Core Components

### Kong Control Plane (Infrastructure)

_The "mother ship" of Kong's architecture_

- **[[../Glossary/API Glossary#Kong-Specific Terminology|Kong Manager]]**: GUI for administration
- **Kong Admin API**: RESTful API for configuration
- Manages configuration and administrative functions
- Control plane sends configuration to data plane

> [!IMPORTANT]
> 
> - If the control plane goes down (e.g., database crashes), the data plane still functions with cached configurations
> - New services cannot be added during control plane outage
> - Data plane loses configurations if restarted during an outage
> - Data plane and control plane typically run in separate pods

### [[../Glossary/Kong Glossary|Kong Data Plane]] (Application)

_Responsible for actual request proxying_

- Handles the actual API traffic
- Executes policies and routes requests
- Gets configuration from control plane

 ## Administrative Interfaces

### Kong Admin API

- [[../Glossary/API Glossary#API Design Concepts|RESTful]] interface for programmatic administration
- Used for CI/CD automation
- Enables programmatic control of Kong configurations

### Kong Manager

- Graphical user interface for gateway management
- Provides visualization and control of routes and services

### decK

- Configuration management tool for Kong Gateway
- Helps manage Kong's gateway services
- Enables version control of configurations
- Facilitates GitOps workflows

## Key Concepts

### Services

- Entities representing external upstream APIs or microservices
- The actual destination where Kong forwards requests
- Think of a Service as the address of a restaurant you want to visit
- Configured with protocol, host, port, and path
- Can include connection timeouts and retries

### Routes

- Define how requests are sent to Services
- Determined by paths, hosts, headers, and other conditions
- Routes are associated with specific Services
- Support advanced pattern matching using regex
- Can be versioned (e.g., `/v1/users`, `/v2/users`)
- Multiple Routes can point to the same Service

**Analogy**:

- **Routes** are like the sorting rules that determine which packages (requests) go where
- Each package has an address label (URL path, HTTP method, headers)
- The sorting clerk (Kong) reads these labels and directs the package to the right delivery truck
- **Services** are like the final destinations (the actual API endpoints)

### Consumers

- Represent users of your API
- Can be associated with credentials for [[../Glossary/API Glossary#Authentication & Security|authentication]]
- Enable personalized rate limiting and access controls

**Analogy**:

- Think of Consumers as members of a private club
- Each member has their own membership card (API key or credentials)
- The doorman (Kong) checks these cards before allowing entry
- Different members have different privileges (rate limits, accessible areas)
- The club keeps track of how often each member visits (analytics)

### Plugins

- Modular tools that extend Kong's functionality
- Can be applied globally, per service, per route, or per consumer
- Categories include:
    - **Authentication**: Key auth, JWT, OAuth2, etc.
    - **Security**: IP restriction, bot detection, etc.
    - **Traffic Control**: Rate limiting, request size limiting, etc.
    - **Serverless**: AWS Lambda, Azure Functions, etc.
    - **Analytics & Monitoring**: Datadog, Prometheus, etc.
    - **Transformations**: Request/response transformer, correlation ID, etc.

## Kong Configuration

### DB-less Mode

- Runs without a database dependency
- Uses declarative configuration files
- Ideal for containerized environments
- Configuration stored in memory
- Changes require redeployment

### Database Mode

- Uses PostgreSQL or Cassandra as a data store
- Supports dynamic configuration changes
- Better for environments requiring frequent updates
- Enables clustering for high availability

## Kong Deployment Models

### Traditional (Classic)

- Separate control plane and data plane
- Database-backed for configuration
- Best for environments requiring frequent changes

### Hybrid

- Centralized control plane with distributed data planes
- Allows for multi-region/multi-cloud deployments
- Control plane manages multiple data planes

### DB-less

- No database dependency
- Configuration via declarative YAML/JSON files
- Ideal for Kubernetes and GitOps workflows