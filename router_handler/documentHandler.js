const fs = require('fs')
const documentConvert = require('../oss/documentConvert')
const { saveFile, putFile } = require('../utils/utils')

exports.pdfconvert = (req, res) => {
  switch(req.body.convertType) {
    case 'word': this.pdftoword(req, res); break;
    case 'excel': this.pdftoexcel(req, res); break;
    case 'image': this.pdftoimage(req, res); break;
    default: res.send({status: 500, msg: '传值有误'}); break;
  }
}

exports.pdftoword = (req, res) => {
  const func = (response) => {
    let localFile = './' + response.fileName
    if (response.status == 200) {
      documentConvert.pdfTowordSubmit(response.fileName).then(submitRes => {
        if(submitRes.data && submitRes.data.id) {
          res.send({
            status: 200,
            data: { jobId: submitRes.data.id }
          })
        } else {
          res.send({
            status: 500,
            msg: submitRes.message
          })
        }
        fs.unlinkSync(localFile);
      })
    } else {
      res.send({
        status: 500,
        msg: '上传失败'
      })
      fs.unlinkSync(localFile);
    }
  }
  saveFile(req, func)
}

exports.pdftoexcel = (req, res) => {
  const func = (response) => {
    let localFile = './' + response.fileName
    if (response.status == 200) {
      documentConvert.pdfToexcelSubmit(response.fileName).then(submitRes => {
        if(submitRes.data && submitRes.data.id) {
          res.send({
            status: 200,
            data: { jobId: submitRes.data.id }
          })
        } else {
          res.send({
            status: 500,
            msg: submitRes.message
          })
        }
        fs.unlinkSync(localFile);
      })
    } else {
      res.send({
        status: 500,
        msg: '上传失败'
      })
      fs.unlinkSync(localFile);
    }
  }
  saveFile(req, func)
}

exports.pdftoimage = (req, res) => {
  const func = (response) => {
    let localFile = './' + response.fileName
    if (response.status == 200) {
      documentConvert.pdfToimageSubmit(response.fileName).then(submitRes => {
        if(submitRes.data && submitRes.data.id) {
          res.send({
            status: 200,
            data: { jobId: submitRes.data.id }
          })
        } else {
          res.send({
            status: 500,
            msg: submitRes.message
          })
        }
        fs.unlinkSync(localFile);
      })
    } else {
      res.send({
        status: 500,
        msg: '上传失败'
      })
      fs.unlinkSync(localFile);
    }
  }
  saveFile(req, func)
}

exports.imageconvert = (req, res) => {
  switch(req.body.convertType) {
    case 'word': this.imagetoword(req, res); break;
    case 'excel': this.imagetoexcel(req, res); break;
    case 'pdf': this.imagetopdf(req, res); break;
    default: res.send({status: 500, msg: '传值有误'}); break;
  }
}

exports.imagetoword = (req, res) => {
  const func = async (response) => {
    if (response.status != 200) {
      res.send(response)
      return
    }
    documentConvert.imageToWordSubmit(response.data.url).then(submitRes => {
      if (submitRes.data && submitRes.data.id) {
        res.send({
          status: 200,
          data: { jobId: submitRes.data.id }
        })
      } else {
        res.send({
          status: 500,
          msg: submitRes.message
        })
      }
    })
  }
  putFile(req, func)
}

exports.imagetoexcel = (req, res) => {
  const func = async (response) => {
    if (response.status != 200) {
      res.send(response)
      return
    }
    documentConvert.imageToExcelSubmit(response.data.url).then(submitRes => {
      if (submitRes.data && submitRes.data.id) {
        res.send({
          status: 200,
          data: { jobId: submitRes.data.id }
        })
      } else {
        res.send({
          status: 500,
          msg: submitRes.message
        })
      }
    })
  }
  putFile(req, func)
}

exports.imagetopdf = (req, res) => {
  const func = async (response) => {
    if (response.status != 200) {
      res.send(response)
      return
    }
    documentConvert.imageToPdfSubmit(response.data.url).then(submitRes => {
      if (submitRes.data && submitRes.data.id) {
        res.send({
          status: 200,
          data: { jobId: submitRes.data.id }
        })
      } else {
        res.send({
          status: 500,
          msg: submitRes.message
        })
      }
    })
  }
  putFile(req, func)
}

exports.queryjob = async(req, res) => {
  documentConvert.getResult(req.body.jobId).then(response => {
    res.send({
      status: 200,
      data: response
    })
  })
}