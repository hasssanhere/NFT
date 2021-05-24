//const Web3 = require('web3')
// const web3 = new Web3(
//   new Web3.providers.WebsocketProvider(process.env.RPC_WS_URL),
// )
const {
  mint,
  listOnAuction,
  bid,
  claimNft,
  transfer,
} = require('../functions/token')

const {web, token} = require('../service/web3')

 //let provider, web3;
// // const options = {
// //   timeout: 30000, // ms

// //   clientConfig: {
// //       // Useful if requests are large
// //       maxReceivedFrameSize: 100000000,   // bytes - default: 1MiB
// //       maxReceivedMessageSize: 100000000, // bytes - default: 8MiB

// //       // Useful to keep a connection alive
// //       keepalive: true,
// //       keepaliveInterval: -1 // ms
// //   },

// //   // Enable auto reconnection
// //   reconnect: {
// //       auto: true,
// //       delay: 50000, // ms
// //       maxAttempts: 10,
// //       onTimeout: false
// //   }
// // };


// provider = new Web3.providers.WebsocketProvider(process.env.RPC_WS_URL);
// web3 = new Web3(provider);

// provider.on('connect', ()=>{
//   console.log("connected to wss")
// });
// provider.on('error', e => {
//   console.error('WS Infura Error', e);
// });

// provider.on('end', e => {
//   console.log('WS closed');
//   console.log('Attempting to reconnect...');
//    provider = new Web3.providers.WebsocketProvider(process.env.RPC_WS_URL);
//    web3.setProvider(provider);
// });
/// geth  --rpc --rpccorsdomain="https://bsc-dataseed1.binance.org"  --rpcport "8585" --rpcaddr 54.37.246.26 --networkid 56 --rpcapi eth,web3 console





// const contractJson = require('../contract/Market.json')
// const contract = new web3.eth.Contract(
//   contractJson.abi,
//   process.env.CONTRACT_ADDRESSS,
// )



//console.log("listening to events")
// contract.events.allEvents(function (error, event) {
//   if (error) {
//     console.log('error')
//     console.log(error)
//     return
//   }
//   console.log('==========================')
//   console.log(event.event)

//   switch (event.event) {
//     case 'Mint':
//       mint(event)
//       break
//     case 'ListOnAuction':
//       listOnAuction(event)
//       break
//     case 'Bid':
//       bid(event)
//       break
//     case 'ClaimNft':
//       claimNft(event)
//       break
//     case 'Transfer':
//       transfer(event)
//       break
//     default:
//   }
// })


const checkMintedArtwork = async (error, event) => {
  try {
    if (error) {
      throw error
    }
    console.log("====checkMintedArtwork===")
    console.log(error)
    console.log(event)
    let { returnValues } = event
    let { tokenId } = returnValues

    let artwork = await Artwork.findOne({ tokenId: tokenId })
    if (!artwork) {
      console.log('ARTWORK NOT FOUND IT DATABASE TOKENID: ' + tokenId)
      mint(event)
    }
  } catch (err) {
    console.log('===ERROR ON FINDING MINTED===')
    console.log(err)
    return
  }
}


const checkListedArtwork = async (error, event) => {
  try {
    if (error) {
      throw error
    }
    const { returnValues, transactionHash } = event
    let { tokenId } = returnValues

    let transaction = await Transaction.findOne({ hash: transactionHash })
    let artwork = await Artwork.findOne({ tokenId: tokenId })

    if (!transaction) {
      console.log(
        'LISTED TRANSACTION NOT FOUND IT DATABASE TOKENID: ' + tokenId,
      )
      if (artwork.status === 'Mint') {
        listOnAuction(event)
      }
    }
  } catch (err) {
    console.log('===ERROR ON FINDING LISTED ===')
    console.log(err)
    return
  }
}
const checkBidsArtwork = async (error, event) => {
  try {
    if (error) {
      throw error
    }
    const { returnValues, transactionHash } = event
    let { tokenId } = returnValues

    let transaction = await Transaction.findOne({ hash: transactionHash })
    let artwork = await Artwork.findOne({ tokenId: tokenId })

    if (!transaction) {
      console.log(`BIDDED TRANSACTION NOT FOUND IT DATABASE TOKENID: ${tokenId}`)

      if (artwork.status === 'Auction') {
        bid(event)
      }

    }
  } catch (err) {
    console.log('===ERROR ON FINDING BIDS ===')
    console.log(err)
    return
  }
}

const findMintedArtworks =  (tokenId) => {
 // contract.events.Mint({ filter: {}, fromBlock: 0 }, checkMintedArtwork)
//  token.ge
//   let data = {
//     returnValues:{
//       to: , 
//       tokenId: ,
//       artwork:
//     }, 
//     removed: false, 
//     transactionHash: null
//   }

}

// (async()=>{

//   let data = {
//     returnValues:{
//       to: "0xae727636bc31a48fa3d033b654535bcc40d30d94", 
//       tokenId: 1,
//       artwork:'QmeCsayxgxrMyBRvmMqFSPg4LMFP6RGJT6BFYPfoEumJNa/nft.jpg'
//     }, 
//     removed: false, 
//     transactionHash: '0x20f57617a16ff47623c98acb01cdb845c018914149208eb3cb6dcac5859ca595'
//   }
//   mint(data)
//   // let metadataHash = await token.methods.getTokenMetaData('1').call()
//   // console.log(metadataHash)
// })()



const findListedArtworks = async () => {
//  contract.events.ListOnAuction({ filter: {}, fromBlock: 0 }, checkListedArtwork)

}
const findBidsArtworks = async () => {
//contract.events.Bid({ filter: {}, fromBlock: 0 }, checkBidsArtwork)

}



module.exports = {
  findMintedArtworks,
  findListedArtworks,
  findBidsArtworks
}


// ;(async () => {

//   let auction = await contract.methods.getAuction(1).call()
//   console.log(auction)
//   contract.getPastEvents('Transfer', {
//     filter: {tokenId: "1", }, // Using an array means OR: e.g. 20 or 23
//     fromBlock: 0,
//     toBlock: 'latest'
// }, function(error, events){ console.log(events); })
// .then(function(events){
//     console.log(events) // same results as the optional callback above
// });

// })()

// {
//     removed: false,
//     logIndex: 28,
//     transactionIndex: 35,
//     transactionHash: '0xe5e7bb707440bcf560de6bb51d71339ea4b9a50c8227faf130cc1eec7fe04d80',
//     blockHash: '0x6c3b7a761cdc048d1d3dcb4f03f5dfc82bc49370b77aead1b7943fffd97ccc88',
//     blockNumber: 9998349,
//     address: '0x6AEf5E198c76460db6e4330dD59155E72AFdc023',
//     id: 'log_00f3ad33',
//     returnValues: Result {
//       '0': '0x61F389D2B2FDd8C56120E1200202C38Cbf1Aee40',
//       '1': '0xA235745c20bFdc9af15ca015A6D1d5344dF94d4E',
//       '2': '6',
//       from: '0x61F389D2B2FDd8C56120E1200202C38Cbf1Aee40',
//       to: '0xA235745c20bFdc9af15ca015A6D1d5344dF94d4E',
//       tokenId: '6'
//     },
//     event: 'Transfer',
//     signature: '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//     raw: {
//       data: '0x',
//       topics: [
//         '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
//         '0x00000000000000000000000061f389d2b2fdd8c56120e1200202c38cbf1aee40',
//         '0x000000000000000000000000a235745c20bfdc9af15ca015a6d1d5344df94d4e',
//         '0x0000000000000000000000000000000000000000000000000000000000000006'
//       ]
//     }
//   }
