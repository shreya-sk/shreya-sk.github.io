---
author: Shreya Kothari
---
> [!info] Related Notes
> [[Docker Basics]]

#docker #devops #container 
# Setting Up [[Docker Basics]] on macOS (Apple Silicon & Intel)

## 1. Check Mac Compatibility
Before installing Docker, verify your Mac's processor type:
```sh
sysctl -n machdep.cpu.brand_string
```
- **Apple Silicon (M1/M2/M3)**: Requires Docker's ARM version.
- **Intel**: Requires virtualization support (`VMX`). Check with:
  ```sh
  sysctl -a | grep machdep.cpu.features | grep VMX
  ```
  If nothing is returned, your Mac **does not support** Docker.

---

## 2. Install Docker Desktop
1. **Download Docker for macOS** (choose the correct version):  
   🔗 [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. **Install Docker** by dragging it into the Applications folder.
3. **Run Docker** and follow the setup instructions.

---

## 3. Fix Common Docker Issues
### 3.1 Docker Quits Before Opening
Try resetting Docker settings:
```sh
rm -rf ~/Library/Application\ Support/Docker
rm -rf ~/Library/Group\ Containers/group.com.docker
rm -rf ~/Library/Containers/com.docker.*
rm -rf ~/.docker
```
Restart your Mac and try launching Docker again.

### 3.2 Ensure Rosetta 2 is Installed (Apple Silicon Only)
If you have an **M1/M2/M3** Mac, install Rosetta:
```sh
softwareupdate --install-rosetta --agree-to-license
```

### 3.3 Manually Start Docker Daemon
If Docker doesn’t start:
```sh
nohup /Applications/Docker.app/Contents/MacOS/Docker > /dev/null 2>&1 &
```

### 3.4 Check Docker Logs for Errors
```sh
log show --predicate 'process == "Docker"' --last 1h
```
or
```sh
tail -f ~/Library/Containers/com.docker.docker/Data/log/vm/*.log
```

---

## 4. Uninstall & Reinstall Docker
If issues persist, fully remove Docker and reinstall:
```sh
sudo rm -rf /Applications/Docker.app
sudo rm -rf ~/Library/Application\ Support/Docker
sudo rm -rf ~/Library/Group\ Containers/group.com.docker
sudo rm -rf ~/Library/Containers/com.docker.*
sudo rm -rf ~/.docker
sudo rm -rf /Library/PrivilegedHelperTools/com.docker.vmnetd
sudo rm -rf /Library/LaunchDaemons/com.docker.vmnetd.plist
```
Then, reinstall Docker from [Docker's official website](https://www.docker.com/products/docker-desktop).

---

## 5. Verify Docker Installation
After installation, confirm Docker is running:
```sh
docker --version
docker info
```
If Docker is working, you should see version details and system info.

---

🚀 **You're now ready to use Docker on macOS!**

> [!attention] Docker dektop on MAC only does Linux apps (not windows)
