const { putFile } = require('../utils/utils')
const transcodeClient = require('../oss/transcoding')

exports.submitjob = (req, res) => {
  const func = async (response) => {
    if (response.status != 200) {
      res.send(response)
      return
    }
    const submitRes = await transcodeClient.submitJob(response.data.directory)
    res.send({
      status: 200,
      data: {
        jobId: submitRes,
      }
    })
  }
  putFile(req, func)
}

exports.queryjob = async(req, res) => {
  const response = await transcodeClient.queryJob(req.body.jobId)
  res.send({
    status: 200,
    data: response
  })
}