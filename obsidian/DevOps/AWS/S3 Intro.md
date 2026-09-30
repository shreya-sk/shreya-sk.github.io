---
created: 2026-09-29
source: KodeKloud
up: "[[AWS MOC]]"
tags:
  - type/note
  - devops
  - aws
status: evergreen
AutoNoteMover: disable
---

← [[Nav/HOME|Home]] &nbsp;·&nbsp; `= this.up`

# S3 Intro

## S3 Buckets
- S3 is **object storage**, unlike EBS (block) and EFS (file).
	- Max object size: **5 TB**. A single PUT is limited to 5 GB, so use **multipart upload** (recommended above 100 MB).
	- Durability: **11 nines (99.999999999%)**.
	- Consistency: **strong read-after-write** for all operations.
- Can upload files from local env
	- Doesn't understand folders, but can mimic them
		- S3 is a flat structure. `photos/2024/cat.jpg` is one object key, and `photos/2024/` is just a prefix. The console draws folders using `/` as a delimiter.
- The bucket _name_ is globally unique across all AWS accounts, but the bucket itself lives in one region.
- S3 Provides different storage options
- While creating, we have an option to copy all existing bucket configs
- We can only delete an empty bucket

### Objects
- Files/content of bucket
- Each obj can have diff config
- **The "Open" link**
	- It's a **presigned URL**: temporary access signed with the credentials of whoever generated it, and it expires.
		- It's not so much a "security token" as a signature plus an expiry. Learn the term _presigned URL_ because it comes up in exam scenarios.
- buckets and objects are **private by default**, and **Block Public Access** is on by default.
- Making objects public takes two things: turning off Block Public Access _and_ granting access via a bucket policy or ACL.
### Bucket properties
- ARN: Unique identifier
- Updated accordingly as we make changes
### Permissions
- User access management
### Metrics
- Cloud watch metrics
- data used, objects uploaded
### Management
- Life cycle policies
- access points