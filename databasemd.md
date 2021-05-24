//DB

db.createUser( 
  {
    user: "stefan",
    pwd: "2LI5ye6CpFFl5k8Hr4",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)



use admin
db.createUser(
{
user: "stefan",
pwd: passwordPrompt(),
roles: [ { role: "userAdminAnyDatabase", db: "admin" }, "readWriteAnyDatabase" ]
}
)



////git

sudo mkdir -p /srv/git/digiplaza.git

# Init the repo as an empty git repository
cd /srv/git/digiplaza.git
sudo git init --bare

cd /srv/git/digiplaza.git

# Define group recursively to "users", on the directories
sudo chgrp -R users .
# Define permissions recursively, on the sub-directories 
# g = group, + add rights, r = read, w = write, X = directories only
# . = curent directory as a reference
sudo chmod -R g+rwX .

# Sets the setgid bit on all the directories
# https://www.gnu.org/software/coreutils/manual/html_node/Directory-Setuid-and-Setgid.html
sudo find . -type d -exec chmod g+s '{}' +

# Make the directory a Git shared repo
sudo git config core.sharedRepository group

cd /srv/git/digiplaza.git/hooks

# create a post-receive file
sudo touch post-receive

# make it executable 
sudo chmod +x post-receive


#!/bin/sh
# The production directory
TARGET="/srv/www/digiplaza"
# A temporary directory for deployment
TEMP="/srv/tmp/digiplaza"
# The Git repo
REPO="/srv/git/digiplaza.git"
# Deploy the content to the temporary directory
mkdir -p $TEMP
git --work-tree=$TEMP --git-dir=$REPO checkout -f
cd $TEMP
# Do stuffs, like npm install…
# Replace the production directory
# with the temporary directory
cd /
rm -rf $TARGET
mv $TEMP $TARGET