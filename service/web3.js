const Web3 = require('web3')
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPC_HTTP_URL))
//const Tx = require('ethereumjs-tx').Transaction

const tokenJson = require('../contract/Market.json')

const token = new web3.eth.Contract(
  tokenJson.abi,
  process.env.CONTRACT_ADDRESSS,
)



module.exports = {
    token,
    web3
}
  