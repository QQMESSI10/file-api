const express = require('express')
const router = express.Router()

const { verifyToken } = require('../utils/token')

// 导入用户路由处理函数模块
const userHandler = require('../router_handler/userHandler')

router.post('/apply', userHandler.apply)

router.post('/login', userHandler.login)

router.post('/checkToken', verifyToken, userHandler.checkToken)

router.post('/applyList', verifyToken, userHandler.applyList)

router.post('/allApply', verifyToken, userHandler.allApply)

router.post('/applyFail', verifyToken, userHandler.applyFail)

router.post('/applyPass', verifyToken, userHandler.applyPass)

router.post('/releaseVersion', verifyToken, userHandler.releaseVersion)

router.post('/getNewVersion', verifyToken, userHandler.getNewVersion)

router.post('/startVersion', verifyToken, userHandler.startVersion)

router.post('/getVersionList', verifyToken, userHandler.getVersionList)

router.post('/editVersion', verifyToken, userHandler.editVersion)

router.post('/getCode', userHandler.getCode)

module.exports = router