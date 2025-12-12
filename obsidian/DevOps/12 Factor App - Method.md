---
title: 12-Factor App Overview
source: KodeKloud
tags:
  - DevOps
  - Cloud-Native
  - CI/CD
  - Containers
date: 2025-11-19
author: Shreya Kothari
type: theory
---
# Ideally
If your application is independent of server/hosting, it can be hosted anywhere (GCP, Azure, AWS, on-prem). App is not cuopled with the infrastructure - app is "Portable" - able to run the same app on diff env, without changing source code

So an App should:
- Need to be portable - Code not coupled with Infrastructure
-  Have minimal divergence when deployed between dev, test, prod envs to enable CI/CD
- Must be easily scalable by spinning many instances at once
- Suitable for deployment in modern cloud platform (GCP, Azure, AWS, on-prem)

 > How to do that?
 
 ## **12** **Factor App!**
 1. Have 1 **Codebase** - Version Control (GIT > GITHUB/GITLAB (Central repo))
 2. Explicitly declare and isolate **Dependencies** (requirements.txt, and venv or DOCKER container)
 3. Store **config** in Env
 4. Attach **Backing Services** - redis (cache) - store visit count, session info etc (nothing is stored locally)/
 5. Build, Release, Run stages - Seperate
 6. Execute app and 1 or more stateless **Processes** - store session info/logins in external backing services (else if process instance is down, all info is down)
 7. Export services via **Port binding**
 8. Scale out via process model - **concurrency** - Apps should scale horizantally;
 9. **Disposability**
 10. Keep **Dev/Prod parity** - as same as possible
 11. Treat **Logs** as event streams
 12. Admin + Management = one off process
 