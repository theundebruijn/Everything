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
<sup>6 / install the `Fira Code Regular Nerd Font Complete Mono Windows Compatible.otf` fontface — https://github.com/ryanoasis/nerd-fonts/tree/master/patched-fonts/FiraCode/Regular/complete</sup>  
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
<br/>
<sub><sup>copyright © 2020-present, Theun de Bruijn. all rights reserved.</sup></sub>
