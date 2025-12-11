#devops #API 
> [!note] Related Notes
> 
> - [[Kong API Gateway - Overview]] - Core concepts and architecture
> - [[../Glossary/API Glossary]] - Glossary of API and Kong terms

This note tracks progress through the Kong Academy learning modules and summarizes key learnings.
## Module Progress

### 1. Overview
![[assets/Pasted image 20250331130343.png]]
Core concepts and architecture of Kong Gateway. This covers the fundamentals of:

- What is an API Gateway
- Kong's place in the API ecosystem
- Basic architecture and components

Related concepts: [[Kong API Gateway - Overview#What is Kong?|What is Kong?]]

### 2. Working with Kong Manager

Browser based UI for monitoring and configuring the Kong gateway.

- **Hosting Ports**:
    - Port 8002: HTTP
    - Port 8445: HTTPS
- Features:
    - Administrative dashboard
    - Configuration management
    - Monitoring capabilities

Related concepts: [[../Glossary/API Glossary#Kong-Specific Terminology|Kong Manager]], [[Kong API Gateway - Overview#Administrative Interfaces|Administrative Interfaces]]

### 3. Testing APIs with Insomnia

Insomnia is a robust REST client, ideal for testing and debugging APIs.

- Intuitive UI to build, send requests and view responses from APIs
- Features include:
    - Request organization
    - Environment variables
    - Request chaining
    - Response validation

Related concepts: [[../Glossary/API Glossary#Request Components|Request Components]], [[../Glossary/API Glossary#Response Components|Response Components]]

### 4. Testing APIs in the Terminal

Command-line approaches for API testing with Kong:

- Using cURL for API testing
- Command line interactions with Kong Admin API
- Scripting API tests

Related concepts: [[../Glossary/API Glossary#HTTP Methods|HTTP Methods]]

### 5. Configuring Plugins

How to extend Kong functionality through plugins:

- Authentication plugins
- Security plugins
- Traffic control
- Analytics and monitoring
- Transformation plugins

Related concepts: [[Kong API Gateway - Overview#Plugins|Plugins]]

### 6. Creating Consumers

Managing API consumers and their access controls:

- Creating consumer entities
- Associating credentials
- Setting up authentication
- Configuring rate limits

Related concepts: [[Kong API Gateway - Overview#Consumers|Consumers]], [[../Glossary/API Glossary#Authentication & Security|Authentication & Security]]

### 7. Working with the Admin API

Programmatic management of Kong configurations:

- RESTful interface basics
- CRUD operations for Kong entities
- Automating configuration
- CI/CD integration

Related concepts: [[Kong API Gateway - Overview#Kong Admin API|Kong Admin API]]

### 8. Introduction to Workspaces

Organizing and segmenting Kong configurations:

- Creating and managing workspaces
- Workspace-level settings
- Multi-team environments
- Access control for workspaces

Related concepts: [[../Glossary/API Glossary#Kong-Specific Terminology|Workspace]]

### 9. Introduction to Teams

Collaborative features and team management in Kong:

- Role-based access control
- Team management
- Permission models
- Admin delegation

Related concepts: [[../Glossary/API Glossary#Kong-Specific Terminology|Teams]], [[../Glossary/API Glossary#Kong-Specific Terminology|RBAC]]

## Best Practices

### Security

- Implement strong [[../Glossary/API Glossary#Authentication & Security|authentication]]
- Use HTTPS for all traffic
- Apply rate limiting to prevent abuse
- Configure proper network segmentation

### Performance

- Use caching when appropriate
- Monitor and tune worker processes
- Implement request termination for inactive connections
- Consider DB-less mode for performance-critical deployments

### Monitoring

- Set up metrics collection (Prometheus, etc.)
- Implement distributed tracing
- Configure proper logging
- Set alerts for abnormal traffic patterns

### Operational

- Use Infrastructure as Code for configuration
- Implement Canary deployments for updates
- Maintain backup and restore procedures
- Document API changes and versioning strategy

## Notes from Current Learning

> Add your personal notes and insights from each module as you complete them