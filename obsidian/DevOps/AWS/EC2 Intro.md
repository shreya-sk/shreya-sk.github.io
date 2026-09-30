---
created: 2026-09-29
source:
up: "[[AWS MOC]]"
tags:
  - type/note
  - devops
  - aws
status: evergreen
AutoNoteMover: disable
---

← [[Nav/HOME|Home]] &nbsp;·&nbsp; `= this.up`

# EC2 Intro

**Elastic Compute Cloud**: virtual servers you rent from AWS. Instead of buying a physical machine, you spin up a virtual one in minutes and pay for the time you use it.

Basically: *EC2 = rent a virtual server in AWS, pick its size and OS, pay for the time it runs.*
- **Instance**: one virtual server
- **AMI (Amazon Machine Image)**: the template the instance starts from (OS + pre-installed software, e.g. Amazon Linux, Ubuntu, Windows)
- **Instance type**: the size/power of the server (CPU, RAM, network). Named like `t3.micro`, where `t3` is the family and `micro` is the size
- **Key pair**: the login credentials for connecting (SSH) to a Linux instance
- **Security group**: a virtual firewall controlling what traffic can reach the instance
- **EBS volume**: the virtual hard drive attached to the instance
- **Region / AZ**: like S3, instances live in a specific region, and inside one Availability Zone (data centre) within it

## Lifecycle
Launch → **Running** → **Stopped** (pause, you stop paying for compute) → **Terminated** (deleted for good)

### Connection to S3
 S3 stores _files_. EC2 is where you _run things_: apps, websites, scripts. They often work together (an app on EC2 reading files from S3).
