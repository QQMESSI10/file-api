const express = require('express')
const router = express.Router()

const { upload } = require("../utils/utils")

const imageHandler = require('../router_handler/imageHandler')

router.post('/convert', upload.single('file'), imageHandler.convert)

module.exports = router