const User = require('../models/user')
const Artwork = require('../models/artwork')
const Transaction = require('../models/transaction')
const { web3, token } = require('../service/web3')

const {
  mint,
  listOnAuction,
  bid,
  claimNft,
  transfer,
} = require('../functions/token')


exports.mintArtwork = async (req, res) => {
  try {
    let events = req.body.events
    let response = await mint(events.Mint)
    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

exports.ListOnAuction = async (req, res) => {
  try {
    let events = req.body.events
    let response = await listOnAuction(events.ListOnAuction)
    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}

exports.bidArtwork = async (req, res) => {
  try {
    let events = req.body.events
    let response = await bid(events.Bid)
    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
exports.ClaimNftArtwork = async (req, res) => {
  try {
    let events = req.body.events
    let response = await claimNft(events.ClaimNft)
    res.status(200).send(response)
  } catch (err) {
    console.log(err)
    res.status(500).send(err)
  }
}
