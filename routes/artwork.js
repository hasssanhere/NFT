const router = require('express').Router()
const jwt = require('express-jwt');
const { config } = require('../config/jwt');

const artworkController = require('../controllers/artwork')
const eventController = require('../controllers/event')

// need to authozied


router.get('/', artworkController.getArtworks)

router.get('/:tokenId', artworkController.getArtwork)

router.post('/sync/auction', artworkController.syncAuction)

router.get('/get/transactions/:tokenId', artworkController.getArtworkTransaction)

router.get('/get/live/', artworkController.getLiveArtworks)

router.get('/get/sold/', artworkController.getSoldArtworks)


router.get('/creations/:user', artworkController.getUserCreations)

router.get('/collections/:user', artworkController.getUserCollections)

router.get('/search/:search', artworkController.searchByString)

router.post('/event/mint', eventController.mintArtwork)

router.post('/event/list-on-auction', eventController.ListOnAuction)

router.post('/event/bid', eventController.bidArtwork)

router.post('/event/claim-nft', eventController.ClaimNftArtwork)


router.get('/my', jwt(config), artworkController.getMyArtworks)







// router.post('/create', jwt(config), artworkController.createArtwork)

// router.post('/update', jwt(config), artworkController.updateArtwork)


// router.post('/list/on/auction', jwt(config), artworkController.ListArtworkOnAuction)






module.exports = router