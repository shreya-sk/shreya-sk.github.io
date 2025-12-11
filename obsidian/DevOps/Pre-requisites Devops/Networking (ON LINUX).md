We have 2 devices, **System A** and **System B**. How does system A reach System B? 

>[!important] Switch 

We connect them both to a switch (like a post office), and make them familiarised to each other.

If both computers plug into it, they're physically linked. 
`System A  →   Switch   <- System B`

However, just plugging in not enough (knowing where post office is) - They will still need doors to actually receive and send msgs →  INTERFACES!

>[!important] Interfaces 

An interface - either physical or virtual on the host - work just like a house door.
>An **interface** is just the computer’s **door**. Your computer might have a Wi-Fi door. Or a cable (Ethernet) door. Or in a virtual machine, a pretend door.
>Computers use these “doors” to send and receive messages.

Now, how do we check available interfaces (doors)? via: `ip link` command. This shows names like `eth0`, `wlan0`, `ens33` etc.

> [!note] So far, we have a post office located, and doors to send and receive. But where will we send those msgs? We need addresses..

>This is where **subnets** come in.

>[!important] Subnet
>
 
A subnet is simply a neighbourhood of addresses. All addresses starting with 192.168.1.xxx are in one neighbourhood.

If two computers have addresses like:
- 192.168.1.10
- 192.168.1.11

Both live in the same neighbourhood = 192.168.1.0 subnet.
If two houses live in the same neighbourhood, the local post office (the switch) can deliver mail directly

>[!attention] A computer **does not start with a meaningful IP address**, We assign!

So, if we know a subnet, we can assign same addresses to devices of that subnet using: `ip addr add 192.168.1.10/24 dev eth0`: "Make eth0 door reachable on 192.168.1.xxx address!"
### **What happens after we assign the IPs?**

Now both devices:
- Have a **door** (interface)
- Are plugged into the **same switch**
- Live in the **same network neighbourhood**
- Have valid **addresses**
So they can finally communicate.

To test:

`ping 192.168.1.11`

If everything is correct, System A will reach System B directly through the switch.
![[../../Media - Archive/Pasted image 20251123184805.png]]

---
## Talking to Devices on a different subnet
So same subnet is good, what about system in different subnet?
1. Subnet: `192.168.1.0` → A (`192.168.1.10)` & B `(192.168.1.11)`
2. Subnet: `192.168.2.0` → C (`192.168.2.10)` & D `(192.168.2.11)`
   
How will A talk to C?