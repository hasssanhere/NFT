const User = require('../models/user')
const Artwork = require('../models/artwork')
const Transaction = require('../models/transaction')

exports.getAllStats = async (req, res) => {
  try {
    let users = await User.count({
      $or: [{ role: 'creator' }, { role: 'user' }],
    })
    let artworks = await Artwork.count({})
    let transactions = await Transaction.count({})

    return res.status(200).send({users,artworks,transactions })
  } catch (err) {
    return res.status(500).send(err)
  }
}
exports.getAllUsers = async (req, res) => {
  try {
    let users = await User.find({ })
    // let users = await User.find({
    //   $or: [{ role: 'creator' }, { role: 'user' }],
    // })
    return res.status(200).send(users)
  } catch (err) {
    return res.status(500).send(err)
  }
}

exports.getAllArtworks = async (req, res) => {
  try {
    let artworks = await Artwork.find({})
    return res.status(200).send(artworks)
  } catch (err) {
    return res.status(500).send(err)
  }
}

exports.getAllTransactions = async (req, res) => {
  try {
    let transactions = await Transaction.find({})
    return res.status(200).send(transactions)
  } catch (err) {
    return res.status(500).send(err)
  }
}


exports.changeUserRole = async (req, res) => {
  try { 
    let username = req.params.user
    let role = req.params.role

    let user = await User.find({publicAddress: username})
    if(!user){
      return res.status(400).send({messge: "user not found"})
    }
    user.role = role
     let savedUser =  await user.save()
     return res.status(200).send(savedUser)

    
  } catch (err) {
    return res.status(500).send(err)
  }
}

exports.changeUserRole = async (req, res) => {
  try { 
    let username = req.params.user
    let role = req.params.role

    let user = await User.find({publicAddress: username})
    if(!user){
      return res.status(400).send({messge: "user not found"})
    }
    user.role = role
     let savedUser =  await user.save()
     return res.status(200).send(savedUser)

    
  } catch (err) {
    return res.status(500).send(err)
  }
}
