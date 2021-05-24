const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_HTTP_URL))
const Tx = require('ethereumjs-tx').Transaction

const tokenJson = require('../contract/Market.json')

const token = new web3.eth.Contract(
  tokenJson.abi,
  process.env.CONTRACT_ADDRESSS,
)

// ;(async()=>{

//   web3.eth.getBlock(0).then((hash)=>{
//     console.log(hash)
//   })

// })()


exports.getAuction = (tokenId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let auction = await token.methods.getAuction(tokenId).call()
      resolve(auction)
    } catch (err) {
      reject(err)
    }
  })
}

exports.getOwner = (tokenId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let auction = await token.methods.getOwner(tokenId).call()
      resolve(auction)
    } catch (err) {
      reject(err)
    }
  })
}
