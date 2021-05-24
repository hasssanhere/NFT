

docker run -p 443 :8080 -d digiplaza


git remote add deploy ssh://root@54.37.246.26/srv/git/digiplaza.git/

const URI = `mongodb://stefan:2LI5ye6CpFFl5k8Hr4@51.77.122.217:27017/digiplaza?authSource=admin`;


geth attach  ./node/geth.ipc   --rpc --rpcport "8545" --rpcaddr "nft.digiplaza.io" --rpccorsdomain "*"  --ws  console


geth --rpc --rpcport "8545" --rpcaddr "51.77.122.217" --rpccorsdomain "*"  --ws attach ./node/geth.ipc  console


geth --config /usr/digiplaza/bnb-node/config.toml --datadir /usr/digiplaza/bnb-node/node --syncmode snap  --http --http.api personal,eth,net,web3 --http.corsdomain '*' --http.addr 51.77.122.217  --ws --ws.api eth,net,web3 --ws.origins '*' --networkid 56 --nat extip:51.77.122.217
 
geth --config ./config.toml --datadir ./node  --cache 18000 --rpc.allow-unprotected-txs --txlookuplimit 0  --http --http.api personal,eth,net,web3 --http.corsdomain '*' --http.addr 51.77.122.217  --ws --ws.api eth,net,web3 --ws.origins '*' --networkid 56 --nat extip:51.77.122.217 console


--ws --ws.port 8546 --ws.addr 51.77.122.217 --ws.api eth,net,web3 --ws.origins '*'

THIS WROKEDDD
nohup  geth  --config ./config.toml --datadir ./node  --cache 18000 --rpc.allow-unprotected-txs --txlookuplimit 0   --http --http.corsdomain '*'  --ws --ws.port 8546 --ws.addr 51.77.122.217 --ws.api eth,net,web3 --ws.origins '*' -unlock 0xa8220490bE2fCAFd105bcAF56F921D24BAC3Db68 --password password.txt  --mine  --verbosity 5 --allow-insecure-unlock  >> geth.log &

-unlock 0xa8220490bE2fCAFd105bcAF56F921D24BAC3Db68 --password password.txt  --mine   


Public address of the key:   0xa8220490bE2fCAFd105bcAF56F921D24BAC3Db68
Path of the secret key file: node/keystore/UTC--2021-05-20T18-54-07.551780800Z--a8220490be2fcafd105bcaf56f921d24bac3db68


geth attach https://bsc-dataseed1.binance.org   --http --http.port 8547 --http.corsdomain '*'  --ws --ws.port 8548 --ws.addr 51.77.122.217 --ws.api eth,net,web3 --ws.origins '*'



geth   --http --http.api --http.addr "51.77.122.217" personal,eth,net,web3 --http.corsdomain '*' --ws --ws.api eth,net,web3 --ws.origins '*' attach  geth.ipc console


geth --rpc --rpcaddr "0.0.0.0" --rpcport 8545  --rpccorsdomain "*" attach http://51.77.122.217:8546
--rpc --rpcport "8545" --rpcaddr "127.0.0.1" --rpccorsdomain "*"

geth --config ./config.toml --datadir ./node  --cache 18000 --rpc.allow-unprotected-txs --txlookuplimit 0


geth attach http://51.77.122.217:8546


admin.startRPC(host='51.77.122.217', port=8545, cors="*", apis="eth, net, web3", )


curl -H "Content-Type: application/json" -X POST --data '{"jsonrpc":"2.0","method":"web3_clientVersion","params":[],"id":56}' http://51.77.122.217:8545


geth attach --rpc=http://51.77.122.217:8546

 --http --http.port 8545 --http.addr 51.77.122.217 --http.api personal,eth,net --http.corsdomain '*'


[Unit]
Description=Geth

[Service]
Type=simple
Restart=always
RestartSec=12
ExecStart=geth --config /usr/digiplaza/bnb-node/config.toml --datadir /usr/digiplaza/bnb-node/node --syncmode snap

[Install]
WantedBy=default.target


/usr/digiplaza/bnb-node/bsc/build/bin
export PATH=$PATH:/usr/digiplaza/bnb-node/bsc/build/bin




#!/bin/sh
# The production directory
TARGET="/srv/www/digiplaza"
# A temporary directory for deployment
TEMP="/srv/tmp/digiplaza"
# The Git repo
REPO="/usr/digiplaza/app/git/digiplaza.git"
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

git remote add deploy ssh://stefan@51.77.122.217/usr/digiplaza/app/git/digiplaza.git