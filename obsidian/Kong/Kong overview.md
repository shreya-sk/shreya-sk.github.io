https://dev-kong-manager.au.int.sonichealthcare/login : INT ADM
#KONG #API #matt 

Sonic healthcare version of notes on [[../Kong/Kong API Gateway - Overview|Kong API Gateway - Overview]]
## Routes
Exposes to your services with kong gateway.

- we need to specify our ingresses, and point them to KONG. it goes to KONG first, so kong can get the request, and itfigures out where to send them.
- Point our ingress to the kong pods, kong gets the request, and proxies the servies to upstream services
![[../Kong/assets/Pasted image 20250326112219.png]]

## Setting a new service via KONG

### New service
*Inside KONG manager* *> workspaces*

- Go to workspaces - chooze one (mayb a test one)
- Head to Gateway service
- Define the service
	- Set Name (eg. sitsxk4-api)
	- Service endpoint: Protocol (kubernetes service name)
		- **Protocol**: http (becuase kong DATAPORT IS RUNNING SAME CLUSTER SAME PORT. Same as ingress - ingress uses http, so kong also uses http - it's internal so don't need security)
		- **Host**: Go to freelens > services > copy the service name, the namespace and the cluster.
			- get the hostName_Service (Kubernetes service host - DNS - every service has its own DNS - resolved internally inside kubernetes cluster - domain is always : *namespace* + svc.cluster.local - by convention) - kubernets clusters are internal, and clusters have thir own DNS.
			- sitsxk4-api-svcs.*sitsxk4*.svc.cluster.local
			- namespace.service.cluster
		- **path**: blank
		- **port**: 80 (Because service by default listens on port 80 for http), however, in our service manifest if we listen to different port we need to change it here.
		- Dont touch advanced

Because of port forwarding, you're able to open the service in browser externally. So we need to define routes - that other people are able to see it in their browser.
### Defining routes
*Inside KONG manager* *> workspaces*

- paths: like /header: so it can redirect to some site, if /headers is selected. That some site will be the service defined with /header route
- **Hosts**: freelens > ingress > copy hosts. Optional. We also need to match the host along with the path. 
- Route: independent object. Route has an entity name and associated service. Hosts - SNR (Server name information) - how to identify the host of the service coming in and match with the path

so its like inventory/sonichealth/items
versus shopping/sonichealth/items

so /items is the path. Same for shopping/sonichealth and inventory/sonichealth (hosts). Kong needs to 

- Method: GET for
- UNTICK strip Path: if we send out a request to some API, (rewrite the path - one way is to strip path. Remove the path and pass.)

## [[../Kong/Kong API Gateway - Overview|decK]]
- Trying to dump out a workspace config to a file
- creating personal access token to export kong config - to be used as template
- Need to setup decK - i think it exists in dev shared machine
- `deck gateway dump --workspace <workspace> --kong-addr <address> --headers=Kong-Admin-Token:<token>`
- We get all info we need to setup that `<workspace>`
- We use decK to apply the config to the API; we sync to the control plane and then the control plane syncs to data plane.

# IAM - intersystems manager
- intersystems runs apollo - core of sonic healthcare
- 