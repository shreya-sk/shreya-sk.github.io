---
author: Shreya Kothari
tags:
  - Ansible
  - devops
---
#ansible #devops #cicd 
#  🥸 Getting Started with Ansible 
## What is Ansible?
Analogy: think of Ansible as a smart remote control for our servers. Instead of manually logging into each server to install software or change settings, Ansible lets you write simple instructions that it follows automatically.
## Ansible Tasks
1. Automate software installation on various servers
2. Server Configuration
3. Deploy and Automate web application

## Why Use Ansible?
Assume we need to install Apache (a web server) on 10 different servers:
- **Manual**: Log into each server one by one and type commands 
    - Not idempotent (might cause issues if run multiple times)
    - No error handling/state Checking
    - Platform specific
- **Using Ansible**: Write the instructions once, tell Ansible which servers to work on, press a button... 
  - Idempotent, Declarative approach
  - Built-in error handling and State awareness
  - Cross-platform (can be adapted using variables)

## Basic Concepts
> [!TIP] Analogy:
> Imagine you run a restaurant, and today's menu is Italian. You have some chefs, and you have some recipes  you follow. So the playbook will execute the tasks - "Italian for dinner", chefs will respond to it (hosts), and they will use recipes under pasta and pizza (roles) to fulfil the task
```
my_first_ansible/
├── inventory/
│   └── hosts          # Your server list
├── roles/            # Reusable tasks packages
│   ├── apache/      # Role for Apache setup
│   │   ├── tasks/   # Tasks for Apache
│   │   └── files/   # Files needed for Apache
│   └── nginx/       # Another role for Nginx
│       ├── tasks/   # Tasks for Nginx
│       └── files/   # Files needed for Nginx
└── playbooks/       # Your playbook files
    └── web.yml      # Playbook to set up web servers
```

### 1. Inventory File
- This is a file containing list of servers that Ansible will work with
- Like a phone book for your servers
- Simple example:
```ini
# inventory/hosts
[webservers]
web1.example.com
web2.example.com
```
### 2. Playbooks
- These are the instruction files (written in YAML format)
- Like a recipe book telling Ansible exactly what to do
- Example of a simple playbook:
```yaml
# This playbook installs Apache web server

- name: Install Apache  # This is like a title for our task
  hosts: web_servers   # Which servers to work on
  become: yes         # This means "use admin privileges"
  
  tasks:              # This can be moved to a separate file > roles
    - name: Install Apache package
      apt:
        name: apache2
        state: present   # Make sure Apache is installed
```
### 3. Roles
Think of roles as pre-packaged recipes. Instead of writing the same tasks over and over, you create a role once and reuse it.
Each role is a direcotry, containing the tasks for that role.

Example of an Apache role:
```
roles/apache/
├── tasks/
│   └── main.yml      # List of tasks for Apache
└── files/
    └── index.html    # A file we want to copy to servers
```

The `main.yml` in tasks would look like:
```yaml
# roles/apache/tasks/main.yml
- name: Install Apache
  apt:
    name: apache2
    state: present

- name: Start Apache
  service:
    name: apache2
    state: started
```

### 4. Playbook Using Roles
```yaml
# playbooks/web.yml
---
- name: Set up web servers
  hosts: webservers
  become: yes
  roles:
    - apache    # This will run all tasks in apache role
```
## End-to-end example
Let's say you want to set up multiple web servers:
```
my_apache_project/
├── inventory/
│   └── hosts                  # List of your web servers
│
├── roles/
│   └── apache/               # Apache role
│       ├── tasks/
│       │   └── main.yml      # Tasks for Apache installation
│       └── files/
│           └── index.html    # Website file to be copied
│
└── playbooks/
    └── web.yml               # Playbook that uses Apache role
```
1. Create your host file

```yaml
# inventory/hosts

[webservers]
web1.example.com
web2.example.com

```
2. Create an Apache **role**:
```yaml
# roles/apache/tasks/main.yml
- name: Install Apache
  apt:
    name: apache2
    state: present

- name: Start Apache
  service:
    name: apache2
    state: started

- name: Copy website files
  copy:
    src: index.html
    dest: /var/www/html/
```

3. Create the website file:
```html
<!-- roles/apache/files/index.html -->
<html>
<body>
    <h1>Welcome to my server!</h1>
</body>
</html>
```

4. Use the role in your playbook:
```yaml
# playbooks/web.yml
---
- name: Configure web servers
  hosts: webservers
  become: yes
  roles:
    - apache
```

5. Run the playbook:
```bash
ansible-playbook -i inventory/hosts playbooks/web.yml
```

This will:
1. Install Apache on all webservers
2. Start the Apache service
3. Copy index.html file to each server


## First Ansible Commands

### Checking Server Connection
```bash
# Make sure Ansible can talk to our servers
ansible all -i inventory.ini -m ping
```

### Running Your First Playbook
```bash
# Tell Ansible to run our instructions
ansible-playbook -i inventory.ini my_first_playbook.yml
```

### Common Commands to Remember
```bash
# Check if your playbook looks correct
ansible-playbook playbook.yml --check

# Run your playbook
ansible-playbook -i inventory.ini playbook.yml

# See more details about what's happening
ansible-playbook -i inventory.ini playbook.yml -v
```

## Agentless Ansible
1. Control Node: Your local machine where Ansible is installed
2. Managed Nodes: Remote servers being configured
3. Connection: Uses SSH by default
4. No agents required on remote servers

Requirements:
- Python on managed nodes
- SSH access
- Appropriate privileges

## Sample Project structure 

```
my_ansible_project/
├── inventory.ini          # Your server list
├── playbooks/            # Folder for your instruction files
│   └── install_apache.yml
└── ansible.cfg           # Settings file (optional for start)
```