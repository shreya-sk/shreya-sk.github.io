const e=`---
def-type: consolidated
---

## def-type: consolidated
---
# RestFul

_restful, static_

---
# Nginx
_Enginex_

Think of NGINX as a **traffic cop** at the front of your app:

- It **routes requests** to the correct service.
    
- It can **serve static files**, do **load balancing**, and **SSL termination**

A **high-performance web server** that’s also commonly used as Reverse proxy, Load balancer, HTTP cache,API gateway

It’s now widely used to **manage traffic** between users and backend applications.

In a multi-container Docker app, NGINX often acts as the **gateway**:

- **One container for NGINX**
- **Other containers for your app**, like:

NGINX forwards requests to the right container depending on the path or port.

Example:
- \`myapp.com/\` → forwards to frontend container
- \`myapp.com/api\` → forwards to backend container


---

# HTTP

_HyperText Transfer Protocol_

A **protocol** used for transferring data (like HTML pages, images, and text) between a web browser and a web server.  
It is the foundation of all web communication, but **does not encrypt** the data — meaning it's **not secure**.

Used mostly for **static or non-sensitive** content.

---

# HTTPS

_HyperText Transfer Protocol Secure_

A **secure version of HTTP** that uses **TLS (Transport Layer Security)** to encrypt the data transferred between browser and server.  
It protects against **eavesdropping**, **tampering**, and **man-in-the-middle attacks**.

- Shows a 🔒 padlock icon in the browser
    
- Required for **login pages, payment info, and APIs**
    
- Runs on **port 443** (vs HTTP on port 80)
    

---

# GET

_HTTP Method, Request_

An HTTP method used to request data from a server. When you visit a website, your browser typically sends a GET request to retrieve the webpage. GET requests should only retrieve data and not modify any data on the server.

Example: Fetching a user's profile information or retrieving a list of products.

---

# POST

_HTTP Method, Create, Submit_

An HTTP method used to send data to a server to create or update a resource. POST requests are often used when submitting forms online or uploading files. Unlike GET, POST requests can change data on the server.

Example: Creating a new user account or submitting a payment.

---

# PUT

_HTTP Method, Update, Replace_

An HTTP method used to update an existing resource by completely replacing it. The key difference from POST is that PUT is idempotent - calling it multiple times will produce the same result (unlike POST which might create multiple resources).

Example: Updating all fields of a user profile at once.

---

# DELETE

_HTTP Method, Remove_

An HTTP method used to remove a specified resource from the server. This is what happens under the hood when you delete something from a website.

Example: Removing a user account or deleting a post.

---

# PATCH

_HTTP Method, Partial Update_

An HTTP method used to apply partial updates to a resource. Unlike PUT which replaces the entire resource, PATCH only modifies the fields that are provided in the request.

Example: Updating just a user's email address without changing other profile information.

---

# HEAD

_HTTP Method, Metadata_

Similar to GET but returns only the HTTP headers without the response body. This is useful when you want to check what a GET request would return before making the actual request - like checking if a resource exists or when it was last modified.

Example: Checking if a file exists on a server without downloading it.

---

# OPTIONS

_HTTP Method, Communication Options_

An HTTP method that returns the HTTP methods supported by the server for a specific URL. This helps clients determine what actions they can perform on a resource.

Example: A client checking which methods (GET, POST, etc.) are available for an API endpoint.

---

# TRACE

_HTTP Method, Diagnostic_

An HTTP method that provides a diagnostic test along the request-response path. It essentially returns the exact request that was received by the server, helping to debug proxy servers between the client and server.

Example: Troubleshooting why a request is being modified before reaching the server.

---

# Endpoint

_API URL, Resource Location_

The specific URL where an API can be accessed. Think of it as an address that points to a specific function or resource in the API. Each endpoint is designed to perform a specific task or return specific data.

Example: \`https://api.example.com/users\` might be an endpoint that returns user information.

---

# Path Parameters

_URL Components, Dynamic Values_

Variable parts embedded directly in the URL path, typically used to specify a resource identifier. They're denoted with curly braces in API documentation.

Example: In \`/users/{id}\`, the \`{id}\` is a path parameter that would be replaced with an actual user ID like \`/users/123\`.

---

# Query Parameters

_URL Components, Filters_

Key-value pairs added to the end of a URL after a question mark (\`?\`). They're used to sort, filter, or customize the data being requested.

Example: \`/products?category=electronics&sort=price_asc\` has two query parameters that filter for electronics products and sort them by ascending price.

---

# Headers

_HTTP Headers, Metadata_

Additional information sent with HTTP requests and responses. Headers provide instructions or context about the request or response, such as the content type, authentication credentials, or caching directives.

Example: The \`Authorization\` header contains credentials for accessing protected resources, while \`Content-Type\` indicates the format of the data being sent.

---

# Request Body

_HTTP Request, Payload_

The main data sent with a request, typically with POST, PUT, or PATCH methods. The body contains the information you want to send to the server, usually in JSON or XML format.

Example: When creating a new user, the request body might contain the user's name, email, and password in JSON format.

---

# Payload

_Data Transfer, Message Content_

The actual data portion transmitted in an API request or response. This is the "cargo" being delivered between client and server, excluding headers and metadata.

Example: In an API response, the payload might be a JSON object containing user information or a list of products.

---

# Content-Type

_HTTP Header, Media Type_

A header that indicates the format of the data being sent or received. It tells the receiving system how to interpret the data - whether it's JSON, XML, HTML, or another format.

Example: \`Content-Type: application/json\` indicates that the data is in JSON format.

---

# Status Code

_HTTP Response, Result Code_

A three-digit number returned by a server in response to a request. It indicates the outcome of the request - whether it succeeded, failed, or something else happened.

Common status codes:

- 200: OK (Success)
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

---

# Response Body

_HTTP Response, Returned Data_

The data returned by the server in response to a request. This typically contains the information requested by the client or feedback about the success/failure of an operation.

Example: When requesting user information, the response body might contain the user's profile data in JSON format.

---

# Response Headers

_HTTP Response, Metadata_

Additional information returned by the server along with the response. These headers provide context about the response, such as content type, caching instructions, or server information.

Example: The \`Cache-Control\` header tells the client how long it can cache the response.

---

# API Key

_Authentication, Access Token_

A unique string used to identify and authenticate an application or user making API requests. It's like a password that grants access to an API's resources and helps the API provider track and control usage.

Example: When using Google Maps API, you need an API key to authorize your application's access to the mapping services.

---

# OAuth

_Authentication, Authorization Protocol_

A secure authorization protocol that enables third-party applications to access user resources without exposing passwords. It's what happens behind the scenes when you "Sign in with Google" on a website.

Example: When a mobile app asks for permission to access your Google Calendar, it's using OAuth to get authorized access without knowing your Google password.

---

# JWT

_JSON Web Token, Authentication_

A compact, self-contained way for securely transmitting information between parties as a JSON object. JWTs are often used for authentication and information exchange in web development.

Example: After logging in, a server might issue a JWT that the client includes with subsequent requests to prove the user's identity.

---

# Basic Auth

_Authentication, Simple Authentication_

A simple authentication method where the client sends a username and password with each request, encoded in base64 format. Despite the encoding, it's not encrypted unless used with HTTPS.

Example: When accessing an API that requires basic auth, you'd include an \`Authorization\` header with the value \`Basic dXNlcm5hbWU6cGFzc3dvcmQ=\` (which is \`username:password\` in base64).

---

# HMAC

_Hash-based Message Authentication Code, Security_

A specific mechanism for calculating a message authentication code involving a cryptographic hash function combined with a secret key. It's used to verify the integrity and authenticity of a message.

Example: When sending sensitive data to an API, an HMAC might be calculated using the request body and a shared secret, then sent alongside the request for the server to verify.

---

# Rate Limiting

_Security, Traffic Control, Performance_

A technique used to control the amount of requests a user can make to an API within a specified time period. This prevents abuse, ensures fair usage, and protects the API from being overwhelmed.

Example: A weather API might limit clients to 1000 requests per day, after which they receive a "rate limit exceeded" error until the limit resets.

---

# Throttling

_Security, Performance_

Temporarily restricting a client's access to an API when they exceed rate limits. Unlike a hard block, throttling typically allows the client to resume normal access after a cooling-off period.

Example: If a client makes too many requests in a short time, the API might slow down their request processing or temporarily reject new requests until their request rate normalizes.

---

# Authentication

_Security, Identity Verification_

The process of verifying the identity of a user, device, or system attempting to access a resource. Authentication answers the question "Who are you?"

Example: When you log into an online service with username and password, you're authenticating yourself.

---

# Authorization

_Security, Access Control_

The process of determining what a verified user is allowed to do or access. Authorization happens after authentication and answers the question "What are you allowed to do?"

Example: After logging into a content management system, authorization determines which pages you can edit or which settings you can change.

---

# DMZ

_Demilitarized Zone, Network Security_

A perimeter network that acts as a buffer zone between an organization's internal network and untrusted external networks (like the internet). It contains servers that need to be accessible from the outside but maintains a security boundary.

DMZ is used to:

- Safely expose public-facing services (websites, APIs, email) without exposing internal systems
- Create a security buffer between trusted internal networks and untrusted external networks
- Inspect and filter traffic before it enters the internal network
- Contain potential breaches to the exposed zone without compromising the internal network

Example: A company might place their web servers and API gateways in a DMZ, while keeping databases and internal applications on the private network.

---

# REST

_Representational State Transfer, API Architecture_

An architectural style for designing networked applications that uses simple HTTP requests to access and manipulate data. RESTful APIs use standard HTTP methods (GET, POST, etc.) and typically return data in JSON or XML format.

Key principles include:

- Statelessness: Each request contains all information needed
- Resource-based: Everything is a resource with a unique URL
- Standard HTTP methods for different operations

Example: Most modern web APIs are RESTful, like Twitter's API or GitHub's API.

---

# GraphQL

_API Query Language, Data Fetching_

A query language and runtime for APIs that enables clients to request exactly the data they need, nothing more and nothing less. Unlike REST, a single GraphQL endpoint can retrieve all the data a client needs in a single request.

Example: A mobile app might use GraphQL to fetch a user's profile information, their recent posts, and their followers all in one request rather than making three separate API calls.

---

# OpenAPI

_Swagger, API Documentation, API Specification_

A specification for machine-readable interface files for describing, producing, consuming, and visualizing RESTful web services. It provides a standardized way to document API endpoints, parameters, responses, and authentication methods.

Example: A team might create an OpenAPI specification for their API, which can then generate interactive documentation or even client code in various programming languages.

---

# SOAP

_Simple Object Access Protocol, XML Protocol_

A protocol for exchanging structured information in web services using XML. SOAP is more rigid and feature-rich than REST, with built-in error handling and security features, but is also more verbose and complex.

Example: Many enterprise-level services, especially in finance and healthcare, use SOAP for their APIs due to its standardized structure and security features.

---

# Webhooks

_Web Callbacks, Event-Driven APIs_

User-defined HTTP callbacks that are triggered by specific events. Instead of constantly polling an API for changes, webhooks allow a server to push data to a client when something happens.

Example: A payment processor might use webhooks to notify your application when a customer's payment succeeds or fails, rather than requiring your application to check periodically.

---

# Idempotence

_API Design, Operation Property_

A property where an operation can be applied multiple times without changing the result beyond the initial application. This is important for reliability in distributed systems, especially when retrying failed requests.

Example: A PUT request to update a user's profile with the same data multiple times should result in the same final state, regardless of how many times it's sent.

---

# Versioning

_API Management, Compatibility_

The practice of managing changes to an API over time. As APIs evolve, versioning helps ensure backward compatibility and provides a clear migration path for API consumers.

Common versioning strategies include:

- URL path versioning: \`/api/v1/users\`
- Query parameter: \`/api/users?version=1\`
- Custom header: \`X-API-Version: 1\`

Example: When Twitter updates their API with breaking changes, they might release it as a new version (v2) while maintaining the old version (v1) for a transition period.

---

# API Versioning

_API Management, Lifecycle_

The process of managing multiple versions of an API simultaneously. This allows developers to introduce new features or make breaking changes while giving existing clients time to migrate.

Example: A company might maintain API v1 for legacy clients while encouraging new integrations to use API v2 with enhanced features and improved performance.

---

# Kong Manager

_Kong Enterprise, Administration UI_

The graphical user interface for Kong Enterprise that allows administrators to configure, monitor, and manage the API gateway. It provides a user-friendly way to create services, routes, plugins, and consumers without using the Admin API directly.

Example: An API team might use Kong Manager to set up rate limiting on specific endpoints or to monitor traffic patterns across their API gateway.

---

# RBAC

_Role Based Access Control, Security_

A method of regulating access to computer or network resources based on the roles assigned to individual users. In the context of API management, RBAC controls who can view, create, modify, or delete API configurations.

Example: In Kong Enterprise, administrators might be given full access to all settings, while developers might only have permission to view configurations but not change them.

---

# Enterprise Plugins

_Kong Enterprise, Extensions_

Premium extensions available in Kong Enterprise that provide additional functionality beyond the open-source version. These plugins offer advanced capabilities for security, monitoring, authentication, and traffic control.

Example: Kong Enterprise includes plugins for OpenID Connect authentication, advanced rate limiting with machine learning capabilities, and enterprise-grade analytics.

---

# Kong Ingress Controller

_Kong, Kubernetes_

A controller that integrates Kong with Kubernetes, allowing Kong to serve as the Ingress controller for a Kubernetes cluster. It translates Kubernetes Ingress resources into Kong configurations automatically.

Example: When deploying microservices in Kubernetes, the Kong Ingress Controller can automatically configure routes in Kong when new services are deployed, without manual intervention.

---

# Control Plane

_System Architecture, Kong_

The management layer of Kong that handles configuration and administrative functions. In a distributed Kong deployment, the Control Plane is responsible for storing and distributing configuration to the Data Planes.

Example: In a multi-region deployment, a central Control Plane might manage configurations while multiple Data Planes in different regions handle the actual API traffic.

---

# Data Plane

_System Architecture, Kong_

The layer of Kong that actually processes and routes API traffic. The Data Plane applies plugins, enforces policies, and forwards requests to the appropriate backend services based on configurations received from the Control Plane.

Example: When an API request comes in, the Kong Data Plane checks authentication, applies rate limiting if configured, and routes the request to the appropriate microservice.

---

# Workspace

_Kong Enterprise, Organization_

A logical segmentation within Kong Enterprise that allows for isolation of Kong resources (services, routes, plugins, etc.). Workspaces help organize APIs by team, department, or project.

Example: A company might create separate workspaces for their customer-facing APIs, partner APIs, and internal APIs, with different teams managing each workspace.

---

# Teams

_Kong Enterprise, User Management_

Collaborative user groupings within Kong Enterprise that control access to workspaces and resources. Teams are part of Kong's RBAC system and help organize administrators and developers.

Example: A company might have a "Payment API Team" with specific permissions for managing payment-related services within the "Finance" workspace.`;export{e as default};
