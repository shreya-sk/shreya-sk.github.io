---
created: 2026-09-29
source: AWS Certified Solutions Architect – Associate (SAA-C03) exam guide
up: "[[AWS MOC]]"
tags:
  - type/note
  - devops
  - aws
status: seed
AutoNoteMover: disable
---

← [[Nav/HOME|Home]] &nbsp;·&nbsp; `= this.up`

# AWS Services - SAA

Quick reference for the services in scope for the SAA exam, grouped by category.

## Compute

| Short name | Full name | What it does |
| --- | --- | --- |
| EC2 | Elastic Compute Cloud | Virtual servers you rent by the second/hour |
| EC2 Auto Scaling | EC2 Auto Scaling | Adds/removes EC2 instances automatically based on load |
| Lambda | AWS Lambda | Runs your code without servers; pay per request and run time |
| Elastic Beanstalk | AWS Elastic Beanstalk | Upload your app, AWS handles servers, scaling, and load balancing |
| Batch | AWS Batch | Runs large batch/compute jobs, scheduling the servers for you |
| Outposts | AWS Outposts | AWS hardware installed in your own data centre |
| Wavelength | AWS Wavelength | AWS compute inside 5G networks for ultra-low latency to mobile devices |
| Serverless Application Repository | AWS Serverless Application Repository | Catalogue of ready-made serverless apps you can deploy |
| VMware Cloud on AWS | VMware Cloud on AWS | Runs your existing VMware workloads on AWS |

## Containers

| Short name | Full name | What it does |
| --- | --- | --- |
| ECS | Elastic Container Service | AWS's own service for running Docker containers |
| EKS | Elastic Kubernetes Service | Managed Kubernetes |
| Fargate | AWS Fargate | Runs containers (ECS/EKS) without managing any servers |
| ECR | Elastic Container Registry | Stores your Docker images (like a private Docker Hub) |

## Storage

| Short name | Full name | What it does |
| --- | --- | --- |
| S3 | Simple Storage Service | Object storage for any file, any size, highly durable |
| S3 Glacier | Amazon S3 Glacier | Very cheap S3 storage classes for archives; slower to retrieve |
| EBS | Elastic Block Store | Virtual hard drive attached to one EC2 instance |
| EFS | Elastic File System | Shared file system (Linux/NFS) many instances can mount at once |
| FSx | Amazon FSx | Managed file systems: Windows File Server, Lustre (HPC), NetApp ONTAP, OpenZFS |
| Storage Gateway | AWS Storage Gateway | Connects on-premises storage to AWS cloud storage |
| Backup | AWS Backup | Central place to schedule and manage backups across AWS services |
| Elastic Disaster Recovery | AWS Elastic Disaster Recovery (DRS) | Replicates servers to AWS so you can fail over during a disaster |

## Database

| Short name | Full name | What it does |
| --- | --- | --- |
| RDS | Relational Database Service | Managed SQL databases (MySQL, PostgreSQL, MariaDB, Oracle, SQL Server) |
| Aurora | Amazon Aurora | AWS's high-performance MySQL/PostgreSQL-compatible database |
| Aurora Serverless | Amazon Aurora Serverless | Aurora that scales capacity up/down automatically |
| DynamoDB | Amazon DynamoDB | Serverless NoSQL key-value database, single-digit ms latency |
| DAX | DynamoDB Accelerator | In-memory cache in front of DynamoDB (microsecond reads) |
| ElastiCache | Amazon ElastiCache | Managed in-memory cache (Redis/Valkey or Memcached) |
| MemoryDB | Amazon MemoryDB | Durable Redis-compatible in-memory database |
| DocumentDB | Amazon DocumentDB | MongoDB-compatible document database |
| Keyspaces | Amazon Keyspaces | Cassandra-compatible database |
| Neptune | Amazon Neptune | Graph database (relationships, e.g. social networks) |
| QLDB | Quantum Ledger Database | Immutable, verifiable ledger/history of changes |
| Timestream | Amazon Timestream | Time-series database (IoT, metrics) |
| Redshift | Amazon Redshift | Data warehouse for analytics over huge datasets (SQL) |

## Networking & Content Delivery

| Short name | Full name | What it does |
| --- | --- | --- |
| VPC | Virtual Private Cloud | Your own isolated private network in AWS (see [[VPC Intro]]) |
| ELB | Elastic Load Balancing | Spreads traffic across targets: ALB (HTTP), NLB (TCP/UDP), GWLB (appliances) |
| Route 53 | Amazon Route 53 | DNS service + domain registration + health-check-based routing |
| CloudFront | Amazon CloudFront | CDN: caches content at edge locations close to users |
| Global Accelerator | AWS Global Accelerator | Routes users over AWS's global network via fixed IPs for faster, reliable access |
| API Gateway | Amazon API Gateway | Create, publish, and secure APIs (often in front of Lambda) |
| Direct Connect | AWS Direct Connect | Private dedicated network line from your data centre to AWS |
| Site-to-Site VPN | AWS Site-to-Site VPN | Encrypted tunnel over the internet between your network and a VPC |
| Client VPN | AWS Client VPN | VPN for individual users to connect into AWS |
| Transit Gateway | AWS Transit Gateway | Central hub connecting many VPCs and on-prem networks |
| PrivateLink | AWS PrivateLink | Access services privately from a VPC without going over the internet |

## Security, Identity & Compliance

| Short name | Full name | What it does |
| --- | --- | --- |
| IAM | Identity and Access Management | Users, groups, roles, and permission policies |
| IAM Identity Center | AWS IAM Identity Center (formerly SSO) | Single sign-on across multiple AWS accounts and apps |
| Organizations | AWS Organizations | Manage many AWS accounts centrally; SCPs restrict what accounts can do |
| Cognito | Amazon Cognito | Sign-up/sign-in and user identities for your web/mobile app users |
| Directory Service | AWS Directory Service | Managed Microsoft Active Directory |
| STS | Security Token Service | Issues temporary credentials (used when assuming roles) |
| RAM | Resource Access Manager | Share resources (e.g. subnets) across AWS accounts |
| KMS | Key Management Service | Create and manage encryption keys |
| CloudHSM | AWS CloudHSM | Dedicated hardware security module for keys you fully control |
| Secrets Manager | AWS Secrets Manager | Stores secrets (DB passwords, API keys) with automatic rotation |
| ACM | AWS Certificate Manager | Free SSL/TLS certificates for HTTPS, auto-renewed |
| WAF | Web Application Firewall | Blocks web attacks (SQL injection, XSS) at CloudFront/ALB/API Gateway |
| Shield | AWS Shield | DDoS protection (Standard free; Advanced paid) |
| Firewall Manager | AWS Firewall Manager | Manage WAF/Shield/security group rules across accounts centrally |
| Network Firewall | AWS Network Firewall | Managed firewall for filtering traffic in and out of a VPC |
| GuardDuty | Amazon GuardDuty | Threat detection: spots suspicious activity from logs |
| Inspector | Amazon Inspector | Scans EC2, containers, and Lambda for software vulnerabilities |
| Macie | Amazon Macie | Finds sensitive data (e.g. personal info) in S3 |
| Detective | Amazon Detective | Investigates the root cause of security findings |
| Security Hub | AWS Security Hub | One dashboard collecting security findings from many services |
| Audit Manager | AWS Audit Manager | Collects evidence to help with compliance audits |
| Artifact | AWS Artifact | Download AWS compliance reports and agreements |

## Management & Governance

| Short name | Full name | What it does |
| --- | --- | --- |
| CloudWatch | Amazon CloudWatch | Metrics, logs, alarms, and dashboards for your resources |
| CloudTrail | AWS CloudTrail | Logs every API call: who did what, when; Amazon CloudTrail can be used to provide visibility into user activity by recording the actions taken in your Amazon QuickSight account.|
| Config | AWS Config | Records resource configuration over time and checks compliance rules |
| CloudFormation | AWS CloudFormation | Infrastructure as code: create resources from templates |
| Systems Manager | AWS Systems Manager (SSM) | Manage and patch servers, run commands, store parameters |
| Trusted Advisor | AWS Trusted Advisor | Recommendations on cost, security, performance, and limits |
| Health Dashboard | AWS Health Dashboard | Shows AWS outages/events affecting your resources |
| Control Tower | AWS Control Tower | Sets up a secure multi-account environment with guardrails |
| Service Catalog | AWS Service Catalog | Approved catalogue of products teams are allowed to launch |
| Compute Optimizer | AWS Compute Optimizer | Recommends right-sized EC2/Lambda/EBS resources |
| License Manager | AWS License Manager | Tracks software licences (e.g. Oracle, Windows) |
| Managed Grafana | Amazon Managed Grafana | Hosted Grafana dashboards |
| Managed Prometheus | Amazon Managed Service for Prometheus | Hosted Prometheus for container metrics |
| Well-Architected Tool | AWS Well-Architected Tool | Reviews your workload against AWS best practices |
| Auto Scaling | AWS Auto Scaling | Scaling plans across multiple services (EC2, DynamoDB, Aurora, ECS) |
| CLI | AWS Command Line Interface | Control AWS from the terminal |

## Application Integration

| Short name | Full name | What it does |
| --- | --- | --- |
| SQS | Simple Queue Service | Message queue that decouples parts of an app |
| SNS | Simple Notification Service | Pub/sub: push one message to many subscribers (email, SMS, SQS, Lambda) |
| EventBridge | Amazon EventBridge | Event bus that routes events between services; also schedules (cron) |
| Step Functions | AWS Step Functions | Orchestrates multi-step workflows (e.g. chain Lambdas) |
| MQ | Amazon MQ | Managed ActiveMQ/RabbitMQ for apps moving from on-prem brokers |
| AppFlow | Amazon AppFlow | Moves data between SaaS apps (Salesforce, etc.) and AWS |

## Analytics

| Short name | Full name | What it does |
| --- | --- | --- |
| Athena | Amazon Athena | Run SQL queries directly on files in S3, serverless |
| Kinesis Data Streams | Amazon Kinesis Data Streams | Collects real-time streaming data |
| Data Firehose | Amazon Data Firehose (formerly Kinesis Data Firehose) | Loads streaming data into S3, Redshift, OpenSearch, etc. |
| Managed Flink | Amazon Managed Service for Apache Flink (formerly Kinesis Data Analytics) | Real-time analysis of streaming data |
| Kinesis Video Streams | Amazon Kinesis Video Streams | Streams video from devices to AWS |
| MSK | Managed Streaming for Apache Kafka | Managed Kafka |
| EMR | Elastic MapReduce | Big-data processing with Hadoop/Spark |
| Glue | AWS Glue | Serverless ETL (extract, transform, load) + data catalogue |
| Lake Formation | AWS Lake Formation | Builds and secures a data lake on S3 |
| OpenSearch | Amazon OpenSearch Service | Search and log analytics (Elasticsearch successor) |
| QuickSight | Amazon QuickSight | BI dashboards and visualisations;used for creating and publishing interactive dashboards that include ML Insights. |
| Data Exchange | AWS Data Exchange | Find and subscribe to third-party data sets |
| Data Pipeline | AWS Data Pipeline | Older service for moving/transforming data on a schedule |

## Migration & Transfer

| Short name | Full name | What it does |
| --- | --- | --- |
| DMS | Database Migration Service | Migrates databases to AWS with minimal downtime |
| SCT | Schema Conversion Tool | Converts a database schema from one engine to another (e.g. Oracle → Aurora) |
| MGN | AWS Application Migration Service | Lift-and-shift servers to AWS |
| Application Discovery Service | AWS Application Discovery Service | Inventories on-prem servers to plan a migration |
| Migration Hub | AWS Migration Hub | Tracks migration progress in one place |
| DataSync | AWS DataSync | Fast online transfer of files from on-prem to S3/EFS/FSx |
| Transfer Family | AWS Transfer Family | Managed SFTP/FTPS/FTP into S3 or EFS |
| Snow Family | AWS Snowcone / Snowball | Physical devices shipped to you for moving huge data offline |

## Machine Learning

| Short name | Full name | What it does |
| --- | --- | --- |
| SageMaker | Amazon SageMaker | Build, train, and deploy ML models |
| Rekognition | Amazon Rekognition | Image and video analysis (faces, objects) |
| Comprehend | Amazon Comprehend | Text analysis: sentiment, entities, language |
| Transcribe | Amazon Transcribe | Speech to text |
| Polly | Amazon Polly | Text to speech |
| Translate | Amazon Translate | Language translation |
| Lex | Amazon Lex | Chatbots (voice and text), the tech behind Alexa |
| Textract | Amazon Textract | Extracts text and data from scanned documents |
| Kendra | Amazon Kendra | Intelligent search over company documents |
| Forecast | Amazon Forecast | Time-series forecasting |
| Fraud Detector | Amazon Fraud Detector | Detects online fraud |

## Frontend Web & Mobile

| Short name | Full name | What it does |
| --- | --- | --- |
| Amplify | AWS Amplify | Build and host full-stack web/mobile apps |
| AppSync | AWS AppSync | Managed GraphQL APIs |
| Device Farm | AWS Device Farm | Test apps on real phones and browsers |

## Developer Tools

| Short name | Full name | What it does |
| --- | --- | --- |
| X-Ray | AWS X-Ray | Traces requests through your app to find bottlenecks and errors |

## Cost Management

| Short name | Full name | What it does |
| --- | --- | --- |
| Cost Explorer | AWS Cost Explorer | Visualise and analyse your spending |
| Budgets | AWS Budgets | Alerts when cost/usage passes a threshold |
| CUR | Cost and Usage Report | Most detailed billing data, delivered to S3 |
| Savings Plans | Savings Plans | Discount in exchange for committing to spend $X/hour for 1 or 3 years |

## Other

| Short name | Full name | What it does |
| --- | --- | --- |
| IoT Core | AWS IoT Core | Connects IoT devices to AWS |
| WorkSpaces | Amazon WorkSpaces | Virtual desktops in the cloud |
| AppStream 2.0 | Amazon AppStream 2.0 | Streams desktop apps to a browser |
