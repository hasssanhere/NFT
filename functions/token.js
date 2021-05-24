// const Web3 = require('web3')
const fetch = require('node-fetch')
const Bluebird = require('bluebird')
fetch.Promise = Bluebird

const User = require('../models/user')
const Artwork = require('../models/artwork')
const Transaction = require('../models/transaction')

const { getAuction } = require('./auction')
const { makeUrl } = require('./char')

const { web3, token } = require('../service/web3')

const mint = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      console.log('minting')
      const { returnValues, removed, transactionHash } = event
      if (removed) {
        console.log('Mint Event: removed TX: ' + transactionHash)
        reject({ message: 'tx removed' })
        return
      }

      const { to, tokenId, artwork } = returnValues

      let foundedArtwork = await Artwork.findOne({ tokenId: tokenId })
      if (foundedArtwork) {
        console.log('ALREADY MINTED TOKEN ID: ' + tokenId)
        reject({ message: 'already minted token id' + tokenId })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        console.log('TRANSACTION HAS FOUND BUT NO ARTWORK: RARE AND imposible')
        reject({ message: 'transaction found but no artwork mined' })
        return
      }

      let publicAddress = to.toLowerCase()
      let user = await User.findOne({ publicAddress })
      let metadataHash = await token.methods.getTokenMetaData(tokenId).call()

      const newArtwork = new Artwork({
        date: new Date(),
        username: user.username ? user.username : '',
        owner: publicAddress,
        creator: publicAddress,
        artwork: artwork,
        metadata: metadataHash,
        tokenId: tokenId,
        title: null,
        description: null,
        status: 'Mint',
        url: tokenId,
      })

      let metadataResponse = await fetch('https://ipfs.io/ipfs/' + metadataHash)
      if (metadataResponse.status == 200) {
        let metadata = await metadataResponse.json()
        newArtwork.title = metadata.title
        newArtwork.description = metadata.description
        newArtwork.category = metadata.category

        let url = makeUrl(metadata.title)
        let randomNumber = Math.floor(Math.random() * 100000) + 1
        newArtwork.url = url + randomNumber
      }

      const newTransaction = new Transaction({
        date: Date.now(),
        username: user.username ? user.username : '',
        type: 'Mint',
        tokenId: tokenId,
        value: 0,
        from: 0,
        to: publicAddress,
        hash: transactionHash,
      })

      let newlyMintedArtwork = await newArtwork.save()
      let newlyAddedTransaction = await newTransaction.save()
      console.log('Mined Token: ' + tokenId)
      resolve({
        artwork: newlyMintedArtwork,
        transaction: newlyAddedTransaction,
      })
      return
    } catch (err) {
      console.log(err)
      reject(err)
      return
    }
  })
}

const listOnAuction = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {  returnValues, removed, transactionHash } = event
      if (removed) {
        console.log('ListOnAuction Event: removed TX: ' + transactionHash)
        reject({ message: 'ListOnAuction Event: removed TX: ' })
        return
      }
      const { owner, tokenId, price, endTime, currency } = returnValues

      let artwork = await Artwork.findOne({ tokenId: tokenId })
      if (!artwork) {
        // artwork not in database
        console.log('LISTED A ARTWORK NOT IN DATABASE')
        reject({ message: 'LISTED A ARTWORK NOT IN DATABASE' })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        reject({ message: 'Transaction found' })
        return
      }

      artwork.isAuction = true
      artwork.price = price
      artwork.endTime = endTime
      artwork.status = 'Auction'
      artwork.currency = currency == '0'? 'BNB' : 'DIGIPT'

      let publicAddress = owner.toLowerCase()
      let user = await User.findOne({ publicAddress })

      const newTransaction = new Transaction({
        date: Date.now(),
        username: user.username ? user.username : '',
        type: 'ListOnAuction',
        tokenId: tokenId,
        value: price,
        from: publicAddress,
        to: 0,
        hash: transactionHash,
      })

      let updateArtwork = await artwork.save()
      let newlyAddedTransaction = await newTransaction.save()
      resolve({
        artwork: updateArtwork,
        transaction: newlyAddedTransaction,
      })
      return
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

const bid = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {  returnValues, removed, transactionHash } = event
      if (removed) {
        console.log('Bid Event: removed TX: ' + transactionHash)
        reject({ message: 'Bid Event: removed TX:' })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        reject({ message: 'foundedTransaction' })
        return
      }

      const { tokenId, bidder, value } = returnValues

      let publicAddress = bidder.toLowerCase()
      let user = await User.findOne({ publicAddress })

      let artwork = await Artwork.findOne({ tokenId: tokenId })
      if (!artwork) {
        console.log('BIDDED A ARTWORK NOT IN DATABASE')
        reject({ message: 'BIDDED A ARTWORK NOT IN DATABASE' })
        return
      }

      let newBider = {
        time: Date.now(),
        bidder: publicAddress,
        value: value,
      }

      const newTransaction = new Transaction({
        date: Date.now(),
        username: user.username ? user.username : '',
        type: 'Bid',
        tokenId: tokenId,
        value: value,
        from: publicAddress,
        to: 0,
        hash: transactionHash,
      })

      let bidders = artwork.bidders
      bidders.push(newBider)
      artwork.bidders = bidders

      //TODO: have to make sure
      if (value > artwork.price) {
        artwork.price = value
        artwork.owner = publicAddress
      }

      artwork.markModified('bidders')

      let newlyAddedTransaction = await newTransaction.save()
      let updateArtwork = await artwork.save()

      resolve({
        artwork: updateArtwork,
        transaction: newlyAddedTransaction,
      })
      return
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

const claimNft = async (event) => {
  return new Promise(async (resolve, reject) => {
    try {
      const { blockNumber, returnValues, removed, transactionHash } = event
      if (removed) {
        console.log('Claim Nft Event: removed TX: ' + transactionHash)
        reject({ message: 'Claim Nft Event: removed TX:' })
        return
      }
      let foundedTransaction = await Transaction.findOne({
        hash: transactionHash,
      })
      if (foundedTransaction) {
        return
      }
      const { collector, tokenId } = returnValues

      let artwork = await Artwork.findOne({ tokenId: tokenId })

      if (!artwork) {
        console.log('CLAIM ARTWORK NOT IN DATABASE')
        reject({ message: 'CLAIM ARTWORK NOT IN DATABASE' })
        return
      }

      artwork.isAuction = false
      artwork.endTime = null
      artwork.status = 'Owned'

      const newTransaction = new Transaction({
        date: Date.now(),
        username: '',
        type: 'ClaimNft',
        tokenId: tokenId,
        value: 0,
        from: '0',
        to: collector,
        hash: transactionHash,
      })

      let updateArtwork = await artwork.save()
      let newlyAddedTransaction = await newTransaction.save()
      resolve({
        artwork: updateArtwork,
        transaction: newlyAddedTransaction,
      })
      return
    } catch (err) {
      console.log(err)
      reject(err)
    }
  })
}

const transfer = async (event) => {
  //   const { blockNumber, returnValues, removed, transactionHash } = event
  //   if (removed) {
  //     console.log('Mint Event: removed TX: ' + transactionHash)
  //     return
  //   }
  //   const { from, to, tokenId } = returnValues

  //   let toAddress = to.toLowerCase()
  //   let fromAddress = from.toLowerCase()

  //   let artwork = await Artwork.findOne({ tokenId: tokenId })

  //   if (!artwork) {
  //     console.log("NO ARTWORK IN DATABASE")
  //     return
  // }

  //   let auction = await token.methods.getAuction(tokenId).call()
  //   let value = auction.value

  // // only if clam
  //   artwork.isAuction = false
  //   artwork.endTime = null

  //   const newTransaction = new Transaction({
  //     date: Date.now(),
  //     username: "",
  //     type: 'Transfer',
  //     tokenId: tokenId,
  //     value: 0,
  //     from: fromAddress,
  //     to: toAddress,
  //   })

  //   let newlyAddedTransaction = await newTransaction.save()
  return
}

module.exports = {
  mint,
  listOnAuction,
  bid,
  claimNft,
  transfer,
}
