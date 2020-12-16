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
#### MONOREPO

##### 1. monorepo setup
<sup>inspired by the perforce workspace workflow — https://www.perforce.com/video-tutorials/vcs/setting-workspaces-p4v</sup>  
<sup>we get close by utilising git's sparse checkouts, combined with gcp cloud storage for our lfs needs</sup>   
\
<sup><b>_prerequisites:_</b>\
\
wsl2 instance running an up-to-date `ubuntu-20.04-server-cloudimg-amd64-wsl.rootfs.tar.gz`\
`docker engine` and `docker-compose` running natively within wsl2 — not in the win10 host\
</sup>
<br/>
<sup><b>_reproducable steps:_</b>\
\
</sup>
<sup>\# install Cloud SDK — https://cloud.google.com/sdk/docs/install#deb</sup>  
```zsh
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get install apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update
sudo apt install google-cloud-sdk
```
\
<sup>\# authenticate Cloud SDK and set default project</sup>  
```zsh
gcloud auth login # handle flow via an authenticated browser session
gcloud config set project theundebruijn
```
\
<sup>\# authenticate and store Application Default Credentials (ADC) — https://cloud.google.com/sdk/gcloud/reference/auth/application-default/login</sup>  
```zsh
gcloud auth application-default login # handle flow via an authenticated browser session
```
\
<sup>\# install gcsfuse — https://github.com/GoogleCloudPlatform/gcsfuse/blob/master/docs/installing.md</sup>  
```zsh
export GCSFUSE_REPO=gcsfuse-`lsb_release -c -s`
echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | sudo tee /etc/apt/sources.list.d/gcsfuse.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt update
sudo apt install gcsfuse
```
\
<sup>\# install lfs-folderstore — https://github.com/sinbad/lfs-folderstore</sup>  
```zsh
wget https://github.com/sinbad/lfs-folderstore/releases/download/v1.0.0/lfs-folderstore-linux-amd64-v1.0.0.zip -P ~
cd ~
7z x lfs-folderstore-linux-amd64-v1.0.0.zip
sudo mv ./lfs-folderstore-linux-amd64/lfs-folderstore /usr/local/bin/
sudo chmod +x /usr/local/bin/lfs-folderstore
rm -rf ~/lfs-folderstore-linux-amd64
rm ~/lfs-folderstore-linux-amd64-v1.0.0.zip
```
##### 2. monorepo workflow
<sup>based on — https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/</sup>  
\
<sup><b>_prerequisites:_</b>\
\
complete the `monorepo setup` outlined above\
</sup>
<br/>
<sup><b>_reproducable steps:_</b>\
\
</sup>
<sup>\# mount the gcp storage bucket — https://cloud.google.com/storage</sup>  
```zsh
mkdir ~/.gcsfuse_mountpoint
gcsfuse everything-storage-bucket-uswest1-0001 ~/.gcsfuse_mountpoint
ls ~/.gcsfuse_mountpoint
```
\
<sup>\# make sure lfs-folderstore is available on the PATH</sup>  
```zsh
lfs-folderstore --version
```
\
<sup>\# make a sparse checkout</sup>  
```zsh
mkdir -p "/mnt/c/Users/Theun de Bruijn/Everything"
git clone --no-checkout git@github.com-theundebruijn:theundebruijn/Everything.git "/mnt/c/Users/Theun de Bruijn/Everything"
cd "/mnt/c/Users/Theun de Bruijn/Everything"
git config user.name "Theun de Bruijn" && git config user.email "theun@theundebruijn.com"
git lfs install
git config --add lfs.customtransfer.lfs-folder.path lfs-folderstore
git config --add lfs.customtransfer.lfs-folder.args "/home/theundebruijn/.gcsfuse_mountpoint"
git config --add lfs.standalonetransferagent lfs-folder
git sparse-checkout init --cone
git sparse-checkout set THEU0000 THEU0001/Output/Publishing THEU0001/Output/3D
```
<sub><sup>fin.</sup></sub>
<br/>
<sub><sup>copyright © 2020-present, Theun de Bruijn. all rights reserved.</sup></sub>
