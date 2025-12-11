const e=`---
def-type: consolidated
---
## def-type: consolidated
---

# DEV

_Development Environment, Testing Environment_

A server environment used by developers to write and test new code and features. The DEV environment is optimized for rapid iteration and experimentation, not for stability or performance.

DEV environments typically have:

- Relaxed security controls
- Debug features enabled
- Direct developer access
- Frequent updates (sometimes multiple times per day)
- Test data rather than real user data

Example: A developer might deploy their latest code to the DEV environment to test a new feature before submitting it for code review.

---

# QC

_Quality Control, QA Environment, Testing Environment_

An environment specifically designed for testing and quality assurance. QC environments are where dedicated testers or QA engineers systematically verify application functionality, find bugs, and ensure requirements are met.

QC environments typically have:

- Test data designed to exercise all code paths
- Automated testing tools and frameworks
- Monitoring for performance and errors
- More stability than DEV but less than production
- Regular but controlled updates

Example: After developers are satisfied with a feature in DEV, they promote it to QC where QA engineers run regression tests to ensure it doesn't break existing functionality.

---

# UAT

_User Acceptance Testing, Business Validation_

An environment where actual end-users or business stakeholders test the application to verify it meets business requirements and functions as expected in real-world scenarios. UAT is the last testing phase before production deployment.

UAT environments typically have:

- Production-like configuration
- Realistic (sometimes anonymized) production data
- Limited technical debugging tools
- High stability with controlled updates
- Access for business users and stakeholders

Example: Before launching a new ordering system, the sales department would test it in the UAT environment using real-world scenarios to ensure it meets their business processes.

---

# ET

_Engineering Test, Infrastructure Testing_

A specialized environment used by DevOps or Site Reliability Engineers to test infrastructure changes, deployment processes, or performance under load. ET environments focus on the "plumbing" rather than application features.

ET environments typically have:

- Production-like infrastructure
- Load testing tools
- Monitoring and observability tools
- Controlled access for engineering teams
- Varying stability (depending on what's being tested)

Example: Before implementing a new database clustering solution, engineers might test it in the ET environment to ensure it can handle failover scenarios properly.

---

# PROD

_Production Environment, Live Environment_

The environment that serves actual users or customers. Production is the most tightly controlled environment, optimized for reliability, performance, and security rather than development speed.

PROD environments typically have:

- Strict access controls
- Comprehensive monitoring and alerting
- Real user data with full security protections
- Carefully scheduled and tested updates
- Disaster recovery capabilities
- Performance optimizations

Example: The version of your e-commerce website that customers actually use to make purchases is running in the PROD environment.

---

# Pre-PROD

_Pre-Production, Staging_

A mirror or clone of the production environment used for final testing before production deployment. Pre-PROD aims to be as identical to production as possible to catch any environment-specific issues.

Pre-PROD environments typically have:

- Production-like architecture and configuration
- Similar (but not actual) production data
- Final integration testing capabilities
- Limited access
- Deployment processes identical to production

Example: Before releasing a major system update, a company would deploy it to Pre-PROD first, run final tests, and only then promote it to actual production.

---

# BNE

_Brisbane Deployment, Internal Services_

A deployment target in Brisbane data centers, typically used for internal services that don't need to be accessed from outside the organization.

BNE deployments typically:

- Host internal tools and services
- Are protected behind corporate firewalls
- Have optimized connectivity for Brisbane-based staff
- May have less stringent disaster recovery requirements

Example: An internal HR portal might be deployed to BNE since it's only accessed by employees and doesn't need external exposure.

---

# BNE-DMZ

_Brisbane DMZ, External Access_

A deployment target in Brisbane's demilitarized zone (DMZ), designed to safely expose services to external users while maintaining security. The DMZ acts as a buffer between untrusted external networks and trusted internal networks.

BNE-DMZ deployments typically:

- Host public-facing services
- Have additional security monitoring
- Are isolated from internal systems
- Have restricted connectivity to internal resources

Example: A customer-facing API or partner portal would be deployed to BNE-DMZ to allow external access while maintaining security.

---

# SYD

_Sydney Deployment, Secondary Location_

A deployment target in Sydney data centers, used for internal services. Often used as a secondary or backup location to Brisbane for disaster recovery or load distribution.

SYD deployments typically:

- Provide geographic redundancy for critical systems
- Offer improved latency for Sydney-based staff
- Host systems that need to be available even if Brisbane facilities are unavailable
- Mirror or complement BNE deployments

Example: A critical database might be deployed in both BNE and SYD to ensure it remains available even if one data center has an outage.

---

# SYD-DMZ

_Sydney DMZ, External Access_

A deployment target in Sydney's demilitarized zone (DMZ), used for externally accessible services. Like BNE-DMZ, it provides a secure way to expose services to external users.

SYD-DMZ deployments typically:

- Provide geographic redundancy for external-facing services
- Improve latency for users closer to Sydney
- Have the same security controls as BNE-DMZ
- Be part of a broader high-availability strategy

Example: A global API service might be deployed to both BNE-DMZ and SYD-DMZ with load balancing between them to improve reliability and performance.

---

# Deployment Pipeline

_CI/CD Pipeline, Release Pipeline_

An automated process that takes code from version control through various stages of building, testing, and deployment. A well-designed deployment pipeline catches issues early and provides confidence in the release process.

Deployment pipelines typically include:

- Code compilation and building
- Automated testing (unit, integration, etc.)
- Security scanning
- Artifact generation
- Environment promotion
- Deployment automation
- Post-deployment validation

Example: When a developer commits code, the deployment pipeline automatically builds it, runs tests, and if successful, deploys it first to DEV, then QC, UAT, and eventually PROD.

---

# Continuous Integration

_CI, Build Automation_

The practice of frequently merging code changes into a shared repository, followed by automated building and testing. CI catches integration problems early, when they're easier and cheaper to fix.

Continuous Integration typically involves:

- Automated builds triggered by code commits
- Running unit and integration tests
- Code quality and security scanning
- Reporting results back to developers

Example: When a developer pushes code to the repository, a CI server automatically builds the application and runs all tests, notifying the team if anything fails.

---

# Continuous Delivery

_CD, Automated Release_

An extension of Continuous Integration that automatically deploys all code changes to a testing or staging environment after the build stage. Continuous Delivery ensures software can be released at any time by automating the release process.

Continuous Delivery typically involves:

- Everything in Continuous Integration
- Automated deployment to testing environments
- Integration and acceptance testing
- Prepared production deployment (ready to go with approval)

Example: After passing CI, changes are automatically deployed to QC and UAT environments, with production deployment requiring only a manual approval.

---

# Continuous Deployment

_CD, Automated Production Release_

A practice where every change that passes automated tests is automatically deployed to production without manual intervention. This approach requires a high level of test coverage and maturity in deployment processes.

Continuous Deployment typically involves:

- Everything in Continuous Delivery
- Automated production deployment
- Canary or blue-green deployment strategies
- Automated rollback capabilities
- Comprehensive monitoring and alerting

Example: When a feature branch is merged to main and passes all automated tests, it's automatically deployed to production in a carefully controlled manner.

---

# Blue-Green Deployment

_Deployment Strategy, Zero-Downtime Deployment_

A technique that reduces downtime by running two identical production environments called Blue and Green. At any time, only one environment is live, serving production traffic. When deploying, you update the non-live environment and then switch traffic to it.

Blue-Green deployment provides:

- Zero-downtime deployments
- Easy rollback (just switch back to the previous environment)
- Opportunity to test in a production-like environment
- Reduced risk when deploying

Example: A company might deploy a new version to their "Green" environment while "Blue" serves users, test it thoroughly, and then switch the load balancer to point to "Green," instantly making the new version live.

---

# Canary Deployment

_Deployment Strategy, Gradual Rollout_

A technique where a new version is gradually rolled out to a small subset of users before being deployed to the entire infrastructure. This allows testing in production with real users while limiting the impact of potential issues.

Canary deployment provides:

- Early detection of issues with real user traffic
- Limited blast radius for problems
- Ability to collect user feedback before full rollout
- Gradual verification of system performance

Example: A new feature might first be deployed to 5% of users, then 20%, then 50%, and finally 100% as confidence in its stability increases.

---

# Rollback

_Deployment Recovery, Reversion_

The process of reverting to a previous version of software after a failed deployment. A good deployment strategy includes a clear, tested rollback plan for when things go wrong.

Effective rollback capabilities include:

- Clear decision criteria for when to rollback
- Automated or simple manual process to restore previous version
- Preservation of data during rollback
- Minimal downtime during reversal

Example: If users report critical errors after a deployment, operations might trigger a rollback to the previous version while developers investigate the issue.

---

# Infrastructure as Code

_IaC, Configuration Management_

The practice of managing and provisioning computing infrastructure through machine-readable definition files rather than manual processes. IaC treats infrastructure configuration like software code, making it versionable, testable, and repeatable.

Infrastructure as Code typically involves:

- Version-controlled infrastructure definitions
- Declarative specifications of environment state
- Automated provisioning and configuration
- Consistency across environments

Example: Instead of manually configuring servers, a team might use Terraform to define their entire cloud infrastructure in code, ensuring development, staging, and production environments are identical.

---

# GitOps

_Deployment Methodology, Declarative Operations_

A way of implementing Continuous Deployment using Git as the single source of truth for declarative infrastructure and applications. In GitOps, any change to the system starts with a change to the Git repository.

GitOps typically involves:

- Git repository as the source of truth
- Pull-based deployment models
- Automated synchronization between Git and infrastructure
- Auditable history of all changes

Example: To deploy a new service, a developer would submit a pull request with the service definition; once approved and merged, an operator automatically applies the changes to the cluster.

---

# Feature Flag

_Feature Toggle, Runtime Configuration_

A technique that allows teams to modify system behavior without changing code. Feature flags enable features to be turned on or off at runtime, facilitating gradual rollouts, A/B testing, or quick disabling of problematic features.

Feature flags provide:

- Ability to separate deployment from feature release
- Targeted releases to specific user segments
- Quick disabling of problematic features without rollback
- Support for A/B testing and experimentation

Example: A company might deploy code for a new checkout flow but keep it hidden behind a feature flag, enabling it first for internal users, then beta testers, and finally all users.

---

# Release Train

_Release Management, Scheduled Deployment_

A scheduled, predictable cadence for shipping software. Instead of deploying changes as they're ready, teams gather changes into scheduled releases that leave the station on a regular schedule.

Release trains provide:

- Predictability for stakeholders and users
- Batch testing of multiple changes together
- Coordination across teams
- Regular rhythm of development and deployment

Example: A product team might operate on a two-week release train, with all approved features shipping together every other Tuesday.

---

# Artifact

_Deployment Asset, Build Output_

A deployable component of your application created during the build process. Artifacts might include container images, compiled binaries, package files, or other deployable units.

Artifacts typically:

- Are uniquely identified (often with version numbers or hashes)
- Are stored in repositories for easy access
- Contain everything needed to deploy a specific version
- Are immutable once created

Example: A build process might produce a Docker container image as its artifact, which is then pushed to a container registry and later deployed to Kubernetes.

---

# Smoke Test

_Deployment Validation, Basic Verification_

Simple tests executed after deployment to verify that the most critical functions of the application are working correctly. Smoke tests provide quick confirmation that a deployment hasn't catastrophically broken the system.

Smoke tests typically:

- Check core functionality only (not exhaustive testing)
- Run quickly (minutes, not hours)
- Fail fast if critical issues are found
- Run automatically after deployment

Example: After deploying a website, smoke tests might verify the home page loads, users can log in, and the checkout process completes successfully.

---

# High Availability

_HA, Reliability, Fault Tolerance_

A system design approach that ensures a prearranged level of operational performance, usually uptime, for a higher than normal period. High availability systems are designed to continue operating despite the failure of individual components.

High availability typically involves:

- Redundancy of critical components
- Elimination of single points of failure
- Reliable crossover to redundant systems
- Geographic distribution
- Automated recovery

Example: A high availability database might use multiple nodes across different availability zones, with automatic failover if the primary node becomes unavailable.`;export{e as default};
