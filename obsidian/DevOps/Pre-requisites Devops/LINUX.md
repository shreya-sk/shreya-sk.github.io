- Robust CLI, good package management.
- Many shels: Bourne shell (sh), C shell (csh), z shll (zsh), **bourne again shell (bash)**
- Many flavours: **CentOS**, Ubuntu, Rd Hat, RHEL etc. 
## Linux Kernel

>[!note] Kernel - the primary component of an operating system, serving as the core interface between computer hardware and application processes.
>Like a librarian, who manages books, dvds(hardware resources) between students (application process) in a library (OS system)
- Responsibilities: Memory management, Process management, device drivers, system alls and security
- Kernel version = `uname` or for more info `uname -r/-a`
### Kernel: Memory Management
Linux kernel memory = kernal space + user space
- Kernel space = section which only the kernel has access to; to run kernel code device drivers, extensions etc. (restricted section of library only the librarian has access to)
- User space = Dedicated to processes running outside the kernel, with restricted access to hardware resources. section which students can use to read books/access materials etc.; All 

## BASH environment variables
- `echo $SHELL`: current shell
- `chsh`: Change shell
- env = all env vars
- Setting new env var: `export OFFICE=wfh` 
- Path variable: What shell uses to search for external commands; if the path var doesn't have the locations of a command or file, that command wont work.
	- To add a path var: `export PATH=$PATH:/OPT/python/bin`
- Bash Prompt variable (what you see before you type) - `echo $PS1`
	- ` echo 'PS1="shreya commands:"'` - this is what will be shown on the left before typing command
	- `echo 'PS1="[\d \t \u@\h:\w]$"'`
### User Profile Variables
User profile scripts, such as `~/.profile`, `~/.bash_profile`, `~/.bashrc`, and others, are executed when a user logs in, allowing the setup of the environment according to personal preferences.

To make changes persistent in Unix-like operating systems, variables, aliases, and other configurations can be added to these profile files. For example, to add a variable using the command line:

```
echo 'export MY_VARIABLE="example_value"' >> ~/.profile
```

This command appends the export statement to the end of the `~/.profile` file, making the variable `MY_VARIABLE` persistent across sessions.

To add an alias, like ll for ls -l, use:

```
echo 'alias ll="ls -l"' >> ~/.profile
```
## Help Commands
- To get help use the `--help` flag after a command
- Or to see the manual, say `man <command>`
	- Manual is linux kernel commands, includes everything from commands, to functions, to system commands to logs etc.
	- Manual has pages 1-8 categorised; 
	- To see the cateogires of the manual type `man man`
		- We will see it can help us with commands and functions both. What happens if we wanna see `printf` function? it's a programming fn + linux command both - which manual wil the man command list.
		- We will have to specific from the `man man` list, what category/page of manual: `man 1 printf` or `man 3 printf`

> What if you don't remember the command that helps you make a new directory - nw what? How do you look for it?

`Apropos`: Command that lets you search through the man pages
- `apropos` director: search all man pages which have the word director (directories/directory)
- When we run this ,it will list the occurence of word across all manual pages (even system commands etc) which are far too advanced.
	- We can shortlist our search by specifying to only look into command pages of the manual: `apropos -s 1,8 director`

>[!error] First time we run APROPOS we will ge an error - as it relies on a database, and we wouldnt have one to begin with (on a new server). Fix by running `sudo mandb`


## Directory System
> 1 big filesystem tree: root at top
- Root = top level directory, nothing above it
- Current directory = working directory = 

![[../../Media - Archive/Pasted image 20251121140612.png]]

To create a Directory Tree in on ecommand use the "p" flag:
`mkdir -p /tmp/level-1/level-2/level-3`

To copy directory from one place to another with all its contents: 
`cp -r old_direct /tmp/new_place`

## VIM
> Use "VI" or "VIM" to enter

### Command Mode
- YY = copy full line
- P = paste line
- DD = Delete
- x = delete one character
### i = insert mode
Edit the file, press esc to exit or ":"

### Last Line mode
:qw = save and quit
:q! = exit without saving

