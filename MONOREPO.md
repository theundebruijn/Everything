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
<sup>inspired by the perforce workspace workflow — https://www.perforce.com/video-tutorials/vcs/setting-workspaces-p4v  
we get close by utilising git's sparse checkouts, combined with gcp cloud storage for our lfs needs</sup>\
<br/>
<sup><b>_prerequisites:_</b>\
\
a wsl2 vm configured using the [devops readme](DEVOPS.md)
</sup>

##### monorepo setup
<sup>1/ install Cloud SDK — https://cloud.google.com/sdk/docs/install#deb</sup>  
```powershell
# powershell (regular user)
wsl -d ubuntu-2010-wsl -u theundebruijn
``` 
```zsh
# zsh (theundebruijn)
echo "deb [signed-by=/usr/share/keyrings/cloud.google.gpg] https://packages.cloud.google.com/apt cloud-sdk main" | sudo tee -a /etc/apt/sources.list.d/google-cloud-sdk.list
sudo apt-get install apt-transport-https ca-certificates gnupg
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key --keyring /usr/share/keyrings/cloud.google.gpg add -
sudo apt update
sudo apt install google-cloud-sdk

# authenticate Cloud SDK and set default project
gcloud auth login # handle flow via an authenticated browser session
gcloud config set project theundebruijn

# authenticate and store Application Default Credentials (ADC)  
gcloud auth application-default login # handle flow via an authenticated browser session
```
<sup>2/ install gcsfuse — https://github.com/GoogleCloudPlatform/gcsfuse/blob/master/docs/installing.md</sup>  
```zsh
# zsh (theundebruijn)
# todo : update this to ubuntu 20.10 (groovy) when available
# for now we downgrade the lsb_release to ubuntu 18.04 (bionic)
# as the 20.04 (focal) release doesn't offer the latest build — https://github.com/GoogleCloudPlatform/gcsfuse/issues/477
export GCSFUSE_REPO=gcsfuse-bionic
echo "deb http://packages.cloud.google.com/apt $GCSFUSE_REPO main" | sudo tee /etc/apt/sources.list.d/gcsfuse.list
curl https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
sudo apt update
sudo apt install gcsfuse
gcsfuse --version
```
<sup>3/ install lfs-folderstore — https://github.com/sinbad/lfs-folderstore</sup>  
```zsh
# zsh (theundebruijn)
wget https://github.com/sinbad/lfs-folderstore/releases/download/v1.0.0/lfs-folderstore-linux-amd64-v1.0.0.zip -P ~
cd ~
7z x lfs-folderstore-linux-amd64-v1.0.0.zip
sudo mv ./lfs-folderstore-linux-amd64/lfs-folderstore /usr/local/bin/
sudo chmod +x /usr/local/bin/lfs-folderstore
rm -rf ~/lfs-folderstore-linux-amd64
rm ~/lfs-folderstore-linux-amd64-v1.0.0.zip
lfs-folderstore --version
```
##### monorepo workflow
<sup>based on — https://github.blog/2020-01-17-bring-your-monorepo-down-to-size-with-sparse-checkout/</sup>  
<sup>howto / perform a sparse checkout of an existing repo</sup>  
```zsh
# zsh (theundebruijn)
# mount the gcp storage bucket — https://cloud.google.com/storage
mkdir ~/.gcsfuse_mountpoint
gcsfuse everything-storage-bucket-uswest1-0001 ~/.gcsfuse_mountpoint
ls ~/.gcsfuse_mountpoint

# make sure lfs-folderstore is available on the PATH
lfs-folderstore --version

# make a sparse checkout</sup>  
git clone --no-checkout git@github.com-theundebruijn:theundebruijn/Everything.git "/mnt/c/Users/Theun de Bruijn/Everything"
cd "/mnt/c/Users/Theun de Bruijn/Everything"
git config user.name "Theun de Bruijn" && git config user.email "theun@theundebruijn.com"
git lfs install
git config --add lfs.customtransfer.lfs-folder.path lfs-folderstore
git config --add lfs.customtransfer.lfs-folder.args "/home/theundebruijn/.gcsfuse_mountpoint"
git config --add lfs.standalonetransferagent lfs-folder
git sparse-checkout init --cone
git sparse-checkout set THEU0000/Input/Resources THEU0001/Input/Resources THEU0001/Output/Publishing THEU0001/Output/3D
git reset --hard main
```
<sup>howto / update the sparse-checkout mapping (post checkout)</sup>  
```zsh
# zsh (theundebruijn)
# mount the gcp storage bucket — https://cloud.google.com/storage
gcsfuse everything-storage-bucket-uswest1-0001 ~/.gcsfuse_mountpoint

# make sure lfs-folderstore is available on the PATH
lfs-folderstore --version

# make a sparse checkout</sup>  
cd "/mnt/c/Users/Theun de Bruijn/Everything"
git sparse-checkout set THEU0000/Input/Resources
```
<sup>howto / sparse-checkout in wsl2</sup>  
```zsh
# zsh (theundebruijn)
# mount the gcp storage bucket — https://cloud.google.com/storage
gcsfuse everything-storage-bucket-uswest1-0001 ~/.gcsfuse_mountpoint

# make sure lfs-folderstore is available on the PATH
lfs-folderstore --version

# make a sparse checkout</sup>  
git clone --no-checkout git@github.com-theundebruijn:theundebruijn/Everything.git ~/Everything
cd ~/Everything
git config user.name "Theun de Bruijn" && git config user.email "theun@theundebruijn.com"
git lfs install
git config --add lfs.customtransfer.lfs-folder.path lfs-folderstore
git config --add lfs.customtransfer.lfs-folder.args "/home/theundebruijn/.gcsfuse_mountpoint"
git config --add lfs.standalonetransferagent lfs-folder
git sparse-checkout init --cone
git sparse-checkout set THEU0000/Input/Tools/Studio
git reset --hard main
```
<br/>
<sub><sup>copyright © 2020-present, Theun de Bruijn. all rights reserved.</sup></sub>
