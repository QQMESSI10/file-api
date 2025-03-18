const path = require('path')
const express = require('express')
const router = express.Router()

const multer = require('multer')
const upload = multer({
  // 文件上传的位置
  // dest: path.join(__dirname, "../public/uploads"),
  fileFilter(req, file, callback) {
    // 解决中文名乱码的问题 latin1 是一种编码格式
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8")
    callback(null, true)
  },
  dest: 'tempFile/'
})

const fileHandler = require('../router_handler/fileHandler')

router.post('/put', upload.single('file'), fileHandler.put)

router.post('/list', fileHandler.list)

router.post('/delete', fileHandler.delete)

router.post('/addFolder', fileHandler.addFolder)

router.post('/deleteFolder', fileHandler.deleteFolder)

router.post('/renameFile', fileHandler.renameFile)

module.exports = router