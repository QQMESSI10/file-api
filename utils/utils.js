// logger  日志
// const log4js = require("log4js");
const log4js = require('log4js')
log4js.configure({
  replaceConsole: true,
  appenders: {
    fileout: {
      type: "dateFile",
      filename: __dirname + "/../logs/logs",
      pattern: "-yyyy-MM-dd.log",
      alwaysIncludePattern: true,
    },
  },
  categories: { default: { appenders: ["fileout"], level: "info" } },
});
exports.logger = (type, msg, label) => {
  const logger = log4js.getLogger(label || "default");
  switch (type) {
    case "error":
      logger.error(msg);
      break;
    case "info":
      logger.info(msg);
      break;
    case "warn":
      logger.warn(msg);
      break;
    default:
      logger.info(msg);
      break;
  }
};

// seqError 错误处理
exports.seqError = (err, res) => {
  console.log(err);
  this.logger("error", err);
  res.errput("未知错误异常，请联系管理员处理！");
};

const fs = require('fs')
const co = require('co')
const ossClient = require('../oss/index')
exports.putFile = (req, func) => {
  let filePath = './' + req.file.path
  console.log(req.file.originalname)
  let temp = req.file.originalname.split('.')
  let lastName = '.' + temp[temp.length - 1]
  let fileName = 'tempFile/' + Date.now() + lastName
  fs.rename(filePath, fileName, async (err) => {
    if (err) {
      console.log(err)
      func({
        status: 500,
        msg: '上传失败' + JSON.stringify(err)
      })
    } else {
      let localFile = './' + fileName
      let key = req.body.catalog + '/' + req.file.originalname
      await co(function* () {
        let result = yield ossClient.put(key, localFile);
        // 上传之后删除本地文件
        fs.unlinkSync(localFile);
        func({
          status: 200,
          data: {
            url: result.url,
            directory: result.name
          }
        })
      }).catch(function (err) {
        console.log(err)
        // 上传之后删除本地文件
        fs.unlinkSync(localFile);
        func({
          status: 500,
          msg: '上传失败' + JSON.stringify(err)
        })
      });
    }
  })
}

exports.saveFile = (req, func) => {
  let filePath = './' + req.file.path
  let temp = req.file.originalname.split('.')
  let lastName = '.' + temp[temp.length - 1]
  let fileName = 'tempFile/' + Date.now() + lastName
  fs.rename(filePath, fileName, (err) => {
    if (err) {
      console.log(err)
      func({
        status: 500,
        msg: '上传失败' + JSON.stringify(err),
        fileName
      })
    } else {
      func({
        status: 200,
        fileName
      })
    }
  })
}

const multer = require('multer')
exports.upload = multer({
  // 文件上传的位置
  // dest: path.join(__dirname, "../public/uploads"),
  fileFilter(req, file, callback) {
    // 解决中文名乱码的问题 latin1 是一种编码格式
    file.originalname = Buffer.from(file.originalname, "latin1").toString("utf8")
    callback(null, true)
  },
  dest: 'tempFile/'
})