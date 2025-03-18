const { putFile } = require('../utils/utils')
const ossClient = require('../oss/index')
const fs = require('fs')
const co = require('co')

const checkFileHead = async(catalog, originalname, index) => {
  try {
      let fileName = catalog + '/' + originalname
      await ossClient.head(fileName);
      let suffix = originalname.split('.')[originalname.split('.').length-1]
      let lastIndex = originalname.lastIndexOf('.')
      let name = originalname.slice(0, lastIndex)
      if (index == 0) {
        name = name + '('+ (index+1) +')' + '.' + suffix
      } else {
        name = name.slice(0, -2) + (index+1) + ')' + '.' + suffix
      }
      return await checkFileHead(catalog, name, index+1)
  }  catch (error) {
    console.log(error)
      if (error.code === 'NoSuchKey') {
        return originalname
      }
  }
}
exports.put = async (req, res) => {
  let originalname = await checkFileHead(req.body.catalog, req.file.originalname, 0)
  req.file.originalname = originalname
  let filePath = './' + req.file.path
  let temp = req.file.originalname.split('.')
  let lastName = '.' + temp[temp.length - 1]
  let fileName = 'tempFile/' + Date.now() + lastName
  fs.rename(filePath, fileName, async (err) => {
    if (err) {
      console.log(err)
      res.send({
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
        res.send({
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
        res.send({
          status: 500,
          msg: '上传失败' + JSON.stringify(err)
        })
      });
    }
  })
}

exports.list = async (req, res) => {
  const result = await ossClient.listV2({
    prefix: req.body.dir + '/',
    delimiter: '/'
  })
  res.send(result)
}

exports.delete = async (req, res) => {
  let result = await ossClient.delete(req.body.fileDir);
  res.send(result)
}

exports.addFolder = async (req, res) => {
  const result = await ossClient.put(req.body.name + '/', Buffer.from(''));
  res.send(result)
}

exports.deleteFolder = async (req, res) => {
  let result = await ossClient.delete(req.body.name);
  res.send(result)
}

exports.renameFile = async (req, res) => {
  let oldName = req.body.oldName
  let newName = req.body.newName
  try {
    // 将srcobject.txt拷贝至同一Bucket下的destobject.txt。
    const copyResult = await ossClient.copy(newName, oldName);
    const deleteResult = await ossClient.delete(oldName);
    if (copyResult && deleteResult) {
      res.send({status: 200, msg: '重命名成功'})
    } else {
      res.send({status: 1, msg: '重命名失败'})
    }
  } catch (e) {
    res.send({status: 1, msg: '重命名失败'})
  }
}