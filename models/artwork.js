const mongoose = require('mongoose')

const artworkSchema = new mongoose.Schema({
  date: {
    type: Date,
  },
  username: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  category: {
    type: String,
  },
  owner: {
    type: String,
  },
  creator:{
    type:String
  },
  metadata: {
    type: String,
  },
  artwork: {
    type: String,
    unique: true,
  },
  tokenId: {
    type: String,
    unique: true,

  },
  isAuction: {
    type: Boolean,
    default: false
  },
  endTime: {
    type: String,
  },
  price: {
    type: Number,
    default: 0
  },
  currency: {
    type: String,
    default: 'BNB'
  },
  bidders: {
    type: [],
    default: []
  },
  url:String,
  status: String,
})
module.exports = mongoose.model('Artwork', artworkSchema)
