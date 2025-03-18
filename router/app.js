const express = require('express')
const router = express.Router()

const { verifyToken } = require('../utils/token')

const appHandler = require('../router_handler/appHandler')

router.post('/list', verifyToken, appHandler.list)

module.exports = router