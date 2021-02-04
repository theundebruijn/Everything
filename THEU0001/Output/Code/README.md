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
#### THEU0001 / OUTPUT / CODE

<sup><b>_prerequisites:_</b>\
\
Microsoft Windows 10 `(x64)` `(enterprise)` — `version 20H2`, `build 19042.685`
a wsl2 vm configured using the devops readme
monorepo checkout configured using the monorepo readme
</sup>

##### DevOps
<sup>1 / setup local docker env (wsl2)</sup>

```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
```
```zsh
# zsh (theundebruijn)
cd "/home/theundebruijn/Work/Theun de Bruijn/Everything/THEU0001/Output/Code/DevOps/"
./local-env.sh start
```
<sup>2 / configure network routing (wsl2 + win10)</sup>

```zsh
# zsh (theundebruijn)
mkdir -p "/home/theundebruijn/Work/Theun de Bruijn/Everything/THEU0001/Output/Code/DevOps/_tmp/"
ip -4 addr show eth0 | grep -oP '(?<=inet\s)\d+(\.\d+){3}' > "/home/theundebruijn/Work/Theun de Bruijn/Everything/THEU0001/Output/Code/DevOps/_tmp/ip_addr.txt"
```
```powershell
# powershell (administrator)
powershell.exe -ExecutionPolicy Bypass -File \\wsl$\ubuntu-2010-wsl\home\theundebruijn\Everything\THEU0001\Output\Code\DevOps\_win10\update_windows_hosts.ps1
```
<sup>3 / setup local docker web instance(s) (wsl2)</sup>

```zsh
# zsh (theundebruijn)
cd "/home/theundebruijn/Work/Theun de Bruijn/Everything/THEU0001/Output/Code/DevOps/"
./local-web.sh install
./local-web.sh update
./local-web.sh upgrade
./local-web.sh start
```
<sup>manage docker (wsl2)</sup>

```zsh
# zsh (theundebruijn)
docker ps # list running containers
docker ps -a # list all containers
docker network ls # list all networks
docker volume ls # list all volumes
docker images # list all dangling images
docker images -f dangling=true # list all dangling images

docker image prune # remove dangling images
docker rmi $(docker images -a -q) # remove all images
docker rm $(docker ps -a -q) # remove all containers
docker network rm <network name> # remove specific network
```
<br/>
<sub><sup>copyright © 2020-present, Theun de Bruijn. all rights reserved.</sup></sub>
