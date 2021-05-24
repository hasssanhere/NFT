const web3 = require('web3')
const fetch = require('node-fetch')
const User = require('../models/user')
const Artwork = require('../models/artwork')
const Transaction = require('../models/transaction')

const { getAuction } = require('../functions/auction')

const {
  findListedArtworks,
  findMintedArtworks,
  findBidsArtworks,
} = require('../events/transfer')

exports.syncAuction = async (req, res) => {
  try {
    const { tokenId } = req.body

    let artwork = await Artwork.findOne({ tokenId: tokenId })

    if (!artwork) {
      return res.status(400).send({ message: 'artwork has not found' })
    }

    if (!artwork.title || !artwork.description) {
      let metadataResponse = await fetch(
        'https://ipfs.io/ipfs/' + artwork.metadata,
      )
      if (metadataResponse && metadataResponse.status == 200) {
        let metadata = await metadataResponse.json()
        console.log(metadata)
        artwork.title = metadata.title
        artwork.description = metadata.description
        console.log('SYNCED META DATA')
      }
    }

    let auction = await getAuction(tokenId)

    if (auction.active) {
      if (artwork.owner !== auction.owner.toLowerCase()) {
        findBidsArtworks()
      }
      if (artwork.price !== auction.price) {
        findBidsArtworks()
      }
      // TODO: find claimnft and other stuff. dont just sync it without the methods
     // artwork.isAuction = auction.active
     // artwork.price = auction.price
      artwork.endTime = auction.endTime
      console.log('SYNCED ACTIVE')
    } else {
     
      findListedArtworks()
      // artwork.isAuction = auction.active
    }

    let updatedArtwork = await artwork.save()
    return res.status(200).send(updatedArtwork)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getUserCreations = async (req, res) => {
  try {
    let searchBy = 'username'
    let user = req.params.user

    if (web3.utils.isAddress(user)) {
      searchBy = 'creator'
    }

    let artworks = await Artwork.find({ [searchBy]: user })

    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getUserCollections = async (req, res) => {
  try {
    let user = req.params.user
    let artworks = await Artwork.find({
      owner: user,
      isAuction: false,
      creator: { $ne: user },
    })
    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getMyArtworks = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)
    if (!user) {
      return res.status(400).send({ message: 'unauthorized' })
    }

    let artworks = await Artwork.find({ username: user.username })

    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
exports.getMyBids = async (req, res) => {
  try {
    const user = await User.findById(req.user.payload.id)
    if (!user) {
      return res.status(400).send({ message: 'unauthorized' })
    }

    let artworks = await Artwork.find({
      bidders: { $all: user.publicAddress },
      isAuction: true,
    })

    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getArtworkTransaction = async (req, res) => {
  try {
    const tokenId = parseInt(req.params.tokenId)
    const transactions = await Transaction.find({ tokenId: tokenId }).sort({
      date: -1,
    })
    return res.status(200).send(transactions)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.getArtworks = async (req, res) => {
  try {
    let liveArtworks = await Artwork.find({ isAuction: true }).sort({
      endTime: -1,
    })
    let soldArtworks = await Artwork.find({ isAuction: false }).sort({
      endTime: -1,
    })
    let artworks = liveArtworks.concat(soldArtworks)
    return res.status(200).send(artworks)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}
exports.getArtwork = async (req, res) => {
  try {
    let tokenId = req.params.tokenId
    let searchBy = 'tokenId'
    if (isNaN(parseInt(tokenId))) {
      searchBy = 'url'
    }

    let artwork = await Artwork.findOne({ [searchBy]: tokenId })


    if (!artwork) {
      if(searchBy == "tokenId"){
        findMintedArtworks(tokenId)
      }
    //  findMintedArtworks()
      return res.status(400).send({ message: 'artwork not found' })
    }
    return res.status(200).send(artwork)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

exports.searchByString = async (req, res) => {
  try {
    let searchQuery = req.params.search
    const LIMIT = 5

    const foundArtworks = await Artwork.find({
      $or: [
        { title: { $regex: searchQuery, $options: 'i' } },
        { tokenId: { $regex: searchQuery, $options: 'i' } },
        { username: { $regex: searchQuery, $options: 'i' } },
      ],
    }).limit(LIMIT)

    const foundCreators = await User.find({
      role: 'creator',
      $or: [
        { username: { $regex: searchQuery, $options: 'i' } },
        { fullname: { $regex: searchQuery, $options: 'i' } },
      ],
    }).limit(LIMIT)

    const data = {
      artworks: foundArtworks,
      creators: foundCreators,
    }

    return res.status(200).send(data)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err)
  }
}

// (async()=>{
//   try{
//     let artworks = await Artwork.find({isAuction: true}).sort({endTime: 1})
//     console.log(artworks)
//     res.status(200).send(artworks)
//   }catch(err){
//     res.status(500).send(err)
//   }
// })()

exports.getLiveArtworks = async (req, res) => {
  try {
    let artworks = await Artwork.find({ isAuction: true }).sort({ endTime: -1 })
    res.status(200).send(artworks)
  } catch (err) {
    res.status(500).send(err)
  }
}
exports.getSoldArtworks = async (req, res) => {
  try {
    let artworks = await Artwork.find({ isAuction: false }).sort({
      endTime: -1,
    })
    res.status(200).send(artworks)
  } catch (err) {
    res.status(500).send(err)
  }
}
