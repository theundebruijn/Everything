```
////////////////////////////////////////////////////////////
//////////////////////////.        /////////////////////////
/////////////////////     .      ..  ...////////////////////
///////////////////    ..  .   ....    .  ./////////////////
//////////////////        . .  . ...  . ... ////////////////
/////////////////     ...................   ////////////////
/////////////////  .(,(/.%,.*%#&&&.//....   ////////////////
/////////////////  .***/..*,*/%,%%#%*/(/(. ,* //////////////
////////////////( ******  #%#((&%%*&///%%*..(.//////////////
/////////////////(/,((//**&.*,%%(*//.**##, .#(//////////////
///////////////( .(,**....* ...,*,,,%&,((*.* .//////////////
///////////////( . **..(*#/ %%%%#,*##,..*%,,.///////////////
////////////////(.,#/%#%%,#(%#(/&&(%,(.//#,..///////////////
//////////////////(,,/*#(.#/ /(&..%/&/(*(.//////////////////
///////////////////( ***#     .,.,/&%%%*.///////////////////
////////////////////(./,/*,,.,&*(((%%(/ ////////////////////
///////////////////////**.*.*//##.*,,,//////////////////////
///////////////////////  ,*%%/@//(*   ./////////////////////
//////////////////////                 /////////////////////
////////////////////                     ///////////////////
```
#### DEVOPS

<sup><b>_prerequisites:_</b>\
\
Microsoft Windows 10 `(x64)` `(enterprise)` — `version 20H2`, `build 19042.685`
</sup>

##### Windows 10 Features
<sup>1 / enable windows subsystem for linux — https://docs.microsoft.com/en-us/windows/wsl/install-win10</sup>  
```powershell
# powershell (administrator)
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart
```  
<sup>2 / reboot</sup>  
<sup>3 / install linux kernel update package `wsl_update_x64.exe` — https://docs.microsoft.com/en-us/windows/wsl/install-win10</sup>  
<sup>4 / install latest `(stable)` microsoft terminal release — https://github.com/microsoft/terminal/releases</sup>  
<sup>5 / install latest visual studio code release `(x64)` `(user installer)` — https://code.visualstudio.com/download</sup>  
<sup>6 / install the `Fira Code Regular Nerd Font Complete Mono Windows Compatible.otf` fontface — https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/FiraCode/Retina/complete/</sup>  
<sup>6 / install the  visual studio code `City Lights` theme — https://marketplace.visualstudio.com/items?itemName=Yummygum.city-lights-theme</sup>  
<sup>7 / configure visual studio code to use `"FiraCode NF Retina"` at `12px`</sup>  
<sup>8 / configure microsoft terminal `settings.json` -> `schemes` :</sup>  
```json
{
    "name" : "City Lights (theundebruijn)",
    "background" : "#181e24",
    "black" : "#333f4a",
    "blue" : "#539afc",
    "cyan" : "#70e1e8",
    "foreground" : "#b7c5d3",
    "green" : "#8bd49c",
    "purple" : "#b62d65",
    "red" : "#d95468",
    "white" : "#718ca1",
    "yellow" : "#ebbf83",
    "brightBlack" : "#41505e",
    "brightBlue" : "#5ec4ff",
    "brightCyan" : "#70e1e8",
    "brightGreen" : "#8bd49c",
    "brightPurple" : "#b62d65",
    "brightRed" : "#d95468",
    "brightWhite" : "#b7c5d3",
    "brightYellow" : "#f7dab3"
}
```
<sup>9 / configure microsoft terminal `settings.json` -> `defaults` :</sup>  
```json
"fontFace" : "FiraCode NF Retina",
"fontSize" : 9,
"colorScheme" : "City Lights (theundebruijn)"
```
<sup>10 / set default wsl version — https://docs.microsoft.com/en-us/windows/wsl/install-win10</sup>  
```powershell
# powershell (regular user)
wsl --set-default-version 2
```  
<sup>11 / download the latest `ubuntu-20.10-server-cloudimg-amd64-wsl.rootfs.tar.gz` — https://cloud-images.ubuntu.com/releases/groovy/release/</sup>  
<sup>12 / create the wsl2 vm
```powershell
# powershell (regular user)
mkdir "C:\Users\Theun de Bruijn\.wsl\"
cp .\Downloads\ubuntu-20.10-server-cloudimg-amd64-wsl.rootfs.tar.gz "C:\Users\Theun de Bruijn\.wsl\"
cd "C:\Users\Theun de Bruijn\.wsl\"
wsl --import ubuntu-2010-wsl ubuntu-2010-wsl ubuntu-20.10-server-cloudimg-amd64-wsl.rootfs.tar.gz
wsl -l -v
```  
<sup>13 / configure vm : add user
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl
```  
```bash
# bash (root user)
adduser theundebruijn
usermod -aG sudo theundebruijn
exit
``` 
<sup>14 / configure vm : wsl config
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
```  
```bash
# bash (theundebruijn)
sudo nano /etc/wsl.conf

# add the following : 
[network]
generateResolvConf = false

[automount]
options = metadata
    
sudo rm /etc/resolv.conf
sudo nano /etc/resolv.conf

# add the following :
nameserver 1.1.1.1
nameserver 1.0.0.1

exit
wsl --shutdown
```
<sup>15 / configure vm : updates
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
```  
```bash
# bash (theundebruijn)
sudo apt update
sudo apt upgrade
sudo apt install git
sudo apt install git-lfs
sudo apt install zsh
chsh -s $(which zsh)
exit
``` 
```powershell
# powershell (regular user)
cp .\Downloads\.zshrc \\wsl$\ubuntu-2010-wsl\home\theundebruijn
wsl -d ubuntu-2010-wsl -u theundebruijn
```  
```zsh
# zsh (theundebruijn)
sudo chown $USER:$USER ./.zshrc
exit
```
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
```
```zsh
# zsh (theundebruijn)
# (run `p10k configure` if needed)
code .
```
<sup>16 / configure vm : ssh
```zsh
# zsh (theundebruijn)
mkdir ~/.ssh
nano ~/.ssh/config

# add the following :
AddKeysToAgent yes

# GitHub
Host github.com-theundebruijn
    HostName github.com
    User git
    IdentitiesOnly yes
    IdentityFile /home/theundebruijn/.ssh/id_ed25519_github.com_theun@theundebruijn.com

cp /mnt/c/Users/Theun\ de\ Bruijn/Downloads/SSH/* ~/.ssh/
chmod 600 ~/.ssh/id_ed25519_github.com_theun@theundebruijn.com
exit
``` 
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
```  
```zsh
# zsh (theundebruijn)
# check if our keys have loaded successfully
ssh-add -l
# add the remotes to our known_hosts (warning: potential mitm attack possible)
# this will prevent the fingerprint errors popping up when git cloning
ssh-keyscan -H github.com >> ~/.ssh/known_hosts
``` 
<sup>17 / install docker engine + docker-compose — https://docs.docker.com/engine/install/ubuntu/ + https://github.com/docker/compose/releases/
```zsh
# zsh (theundebruijn)
sudo apt install apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io
sudo usermod -aG docker $USER
sudo systemctl enable docker
exit
```
```powershell
# powershell (regular user)
wsl --shutdown
wsl -d ubuntu-2010-wsl -u theundebruijn
```    
 ```zsh
# zsh (theundebruijn)
sudo curl -L "https://github.com/docker/compose/releases/download/1.28.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# set dockerd to autostart without sudo pw
(see: https://blog.nillsf.com/index.php/2020/06/29/how-to-automatically-start-the-docker-daemon-on-wsl2/)
sudo visudo
    
# add the following :
theundebruijn ALL=(ALL) NOPASSWD: /usr/bin/dockerd

nano ~/.zshrc

# add the following :
RUNNING=`ps aux | grep dockerd | grep -v grep`
if [ -z "$RUNNING" ]; then
  sudo dockerd > /dev/null 2>&1 &
  disown
fi
    
# workaround for iptables issue
(see: https://forums.docker.com/t/failing-to-start-dockerd-failed-to-create-nat-chain-docker/78269)
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy

exit   
```
<sup>18 / install additional software
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
```  
```zsh
# zsh (theundebruijn)
sudo ln -s /usr/bin/python3.8 /usr/local/bin/python
sudo apt install ffmpeg

sudo curl -L https://yt-dl.org/downloads/latest/youtube-dl -o /usr/local/bin/youtube-dl
sudo chmod a+rx /usr/local/bin/youtube-dl

sudo apt install gifsicle
sudo apt install p7zip-full p7zip-rar
```
<br/>
<sub><sup>copyright © 2020-present, Theun de Bruijn. all rights reserved.</sup></sub>
