const router = require('express').Router()
const jwt = require('express-jwt');
const { config } = require('../config/jwt');
const {isAdmin} = require('../middleware/authentication')
const adminController = require('../controllers/admin')

router.get('/all/stats', jwt(config), isAdmin,  adminController.getAllStats)

router.get('/all/users', jwt(config), isAdmin,  adminController.getAllUsers)

router.get('/all/artworks', jwt(config), isAdmin,  adminController.getAllArtworks)

router.get('/all/transactions', jwt(config), isAdmin,  adminController.getAllTransactions)


module.exports = router