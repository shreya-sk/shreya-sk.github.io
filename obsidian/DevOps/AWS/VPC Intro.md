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

# VPC Intro

> **In one line:** a VPC is your own private network in AWS, split into subnets. NACLs guard the subnet, security groups guard the instance.

## 1. What is a VPC?

**Virtual Private Cloud (VPC)** - a secure, isolated network segment hosted within the AWS Cloud. It lets us isolate resources from other resources in the cloud.
- This is what keeps one customer's resources hidden/separated from everyone else's.
- Even within one AWS account, we can use separate VPCs so that different apps can't talk to each other.
- It gives you full control of networking in the cloud: subnets, route tables, firewalls, and gateways (all explained below).
- A VPC acts as a **network boundary**: by default, VPCs can't talk to each other, and outside traffic can't get in.

## 2. Where a VPC lives: regions and AZs

- **Region** - a geographic area where AWS runs data centres (e.g. `ap-south-1` = Mumbai).
- **Availability Zone (AZ)** - one or more separate data centres *inside* a region. Each region has several AZs, so if one fails the others keep running.
- A VPC belongs to **a single region**, but spans all the AZs in that region.

## 3. The building blocks

### CIDR block (the VPC's IP range)
- The range of IP addresses you give the VPC, e.g. `10.0.0.0/16`.
- Everything inside the VPC gets an IP address from this range.

### Subnets (slices of that range)
- Group of IP Addresses in VPC - in which we deploy instances
- Any subnet deployed within a VPC must be within the CIDR range, e.g. CIDR `192.168.0.0/16` SUBNET: `192.168.10.0/24`.
	- Subnets cannot overlap with other subnets in **same VPC**
	- 
- Each subnet lives in **exactly one AZ**. The VPC spans the region; its subnets are each pinned to one AZ.

### Route tables (where traffic goes)
- A route table is a list of rules saying where traffic from a subnet should be sent.
- Every subnet is attached to a route table.

### Internet Gateway (IGW)
- The thing that connects a VPC to the internet. (Covered properly in the gateways lesson.)
- Just attaching an IGW isn't enough: a subnet's route table also needs a **route** pointing internet traffic at it.

### Public vs private subnets
- **Public subnet** = its route table has a route to the internet gateway.
- **Private subnet** = it doesn't, so it can't be reached from the internet.

## 4. Default VPC vs custom VPC

### Custom VPC (one you create)
- Locked down: nothing gets in or out until you add an internet gateway **and** a route to it.
### Default VPC (one AWS creates for you)
- Every region has one, all with exactly the same config.
- CIDR block is `172.31.0.0/16`.
- Comes with a default subnet in each AZ.
- Comes pre-wired with internet access, so instances there can reach the internet out of the box..
**Default Configuration**
- /16 IPv4 CIDR Block: 172.31.0.0/16
- Every AZ will get a default subnet of /20
- internet gateway attached, and a route that points traffic to 0.0.0.0/0
- NACLs are open inbound and outbound directions, security group allow outbound traffic 



## 5. Firewalls: NACLs and security groups

There are two layers of firewall inside a VPC:

|            | **NACL**                                          | **Security group**                               |
| ---------- | ------------------------------------------------- | ------------------------------------------------ |
| Guards     | the whole **subnet**                              | a single **instance**                            |
| Rules      | allow **and** deny                                | allow only                                       |
| Stateful?  | **No**: return traffic must be allowed separately | **Yes**: return traffic is allowed automatically |
| Rule order | numbered, lowest first, stops at first match      | all rules are checked together                   |

> **Stateless vs stateful:** a *stateful* firewall remembers a request it let in and automatically lets the reply back out. A *stateless* one doesn't remember, so you need rules for both directions.

### NACL (Network Access Control List)
A virtual firewall that controls inbound and outbound traffic **at the subnet level**.
- It's a numbered list of rules that AWS checks in order to decide whether to allow or deny traffic into/out of a subnet.
- It adds an extra layer of security in front of the instances in that subnet, and lets you define fine-grained access controls.
- **Stateless**: return traffic must be explicitly allowed too (rules for both directions).
- Supports **allow AND deny** rules.
- Rules are processed in **number order, lowest first**, and it stops at the first match.
- Applies to **everything in the subnet**.

### Security group
A virtual firewall attached to an **individual instance** (e.g. an EC2 server). Covered in more detail in its own lesson.

## Don't confuse these
- **Security Group / NACL**: firewalls for network traffic
- **AWS WAF**: protects web apps from attacks like SQL injection
- **AWS Shield**: DDoS protection