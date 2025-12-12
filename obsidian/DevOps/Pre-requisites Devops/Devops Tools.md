Genius Idea > Developer writes code > Hosts in locally on their platform
> How do we share it with the world?!

We then identify a server - either in cloud or VM - which can be accessed publically. So we can just simply "COPY" the code onto server.
> but code cannot be run by just *COPYING* it.. system needs to be *configured*

So we also need to make sure the programming language, libraries, the packages etc also exist on that server to help run the code.
> Nice. so Server also has an IP - so your code is accessible at the iP address! We can purchase a domain name, map it to that iP and share that DOMAIN PUBLICLY!

![[../../Media - Archive/Pasted image 20251119154650.png]]

>OK. This makes sense, multiple people colaborate on a project, using GIT or smth, they develop the code, manually build the binary, and deploy on the server.


>So, we add another server: BUILD SERVER. Develop code, manually copy it to build server, then copy manually to deploy server. fair, what if... it breaks on production. So we then also copy to a TEST SERVER after BUILD to make sure no new bugs.

> Isn't that super mannul?! ..YEP...DRUMROLL....FOR ***CI/CD TOOLS***!!!!

So like, github actions, or jenkins or TFS build pipeline/release pipeline. Automated!
![[../../Media - Archive/Pasted image 20251119174258.png]]
> Hang on, what if, we add a new package to the codebase. Won't we still have to manually, configure the Build, test and prod env?

Introduciiiiing CONTAINERS! We can simply, build an image, during "build" phase. And copy that image over to test and prod - solved!
![[../../Media - Archive/Pasted image 20251119174424.png]]

To manage containers - scale up or down, restart failed containers etc. w use a orchestration tool - also called as KUBERNETES! so KUBERNETES only comes in your prdouction environment to manage multiple containers on multiple servers.

> But imagine we need to add another server - it needs to be set up as the exact same way as rest of the servers. Right resources, right verision, correct kerneel or software setting pre configured, maybe some storage. HOW will we manage that every time to avoid human errors, avoid rebuilding the full infra? .. TERRAFORM!

Terraform allow you to define your infrastructure as code. Using manifest files, Terraform provisions new servers with consistent configurations, such as operating system versions, storage, kernel settings, and container runtimes. It's like kubernetes, but for servers instead of containers. Even Terra uses a manifest file.

Once servers are provisioned, the configuration of them can be done via tools like Ansible to automate.
> Doesn't Ansible also provision infra (like tasks to download stuff etc)

Yep - terra and ansible overlap a lot. Both provision, and automate software config:
- Terraform: Provisioning and deprovisiionning
- Ansible: Post configuration activities like installing softwares and configuring them

> OK cool. Now everything is set up. bUT HOW DO WE MONITOR AND SEE STUFF LIKE cpu USAGE, STORAGE, HEALTH ETC.?

Prometheus! Stores and collects info and logs. Grafana! Helps in visualising promethus data in graphs.