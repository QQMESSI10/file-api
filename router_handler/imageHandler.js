const imageConvert = require("../oss/imageConvert")
const { putFile } = require("../utils/utils")

exports.convert = (req, res) => {
  const func = (response) => {
    if (response.status != 200) {
      res.send(response)
      return
    }
    const param = {
      directory: response.data.directory,
      type: req.body.convertType
    }
    imageConvert.format(param).then((convertRes) => {
      console.log(convertRes)
      res.send(convertRes)
    }).catch(() => {
      res.send({
        status: 500,
        msg: '图片格式转换失败'
      })
    })
  }
  putFile(req, func)
}