const $OpenApi = require('@alicloud/openapi-client')
const $mts20140618 = require('@alicloud/mts20140618')
const mts20140618 = require('@alicloud/mts20140618').default

/**
 * Node.js环境版本为8.x及以上。
 */
const accessKeyId = 'LTAI5tBx2LmAirhodndr6Jnh'
const accessKeySecret = 'PvEhhNbYsRczA5fqHp45gbGkeVCQ9j'
/** 管道ID  可在控制台查看 */
const pipelineId = "1ae9420e8a174a7880b6a992d9012a46"; 
/** 转码模板ID */
const templateId = "0e0ccd0fa612445d82a826e0a0d65b94"; 
const ossLocation = "oss-cn-beijing";
const bucket = "qin-file";
const ossUrl = "https://fileoss.qinxiang.cc/"

function inputParam(ossObject) {
  let input = {};
  input.Location = ossLocation;
  input.Bucket = bucket;
  input.Object = encodeURIComponent(ossObject);
  return JSON.stringify(input);
}

function outputParam(ossObject) {
  let firstSplit = ossObject.split('.')
  firstSplit.splice(firstSplit.length -1, 1)
  let catalog = firstSplit.toString('/')
  let outputOSSObject = catalog + '.mp3';
  let output = {};
  output.OutputObject = outputOSSObject;
  output.TemplateId = templateId;
  let outputs = new Array();
  outputs.push(output);
  return JSON.stringify(outputs);
}

/** 初始化 Client */
function createClient() {
  let config = new $OpenApi.Config({ });
  config.accessKeyId = accessKeyId;
  config.accessKeySecret = accessKeySecret;
  /** 接口服务地域 */
  config.regionId = "cn-beijing";
  return new mts20140618(config);
}

const client = createClient()

const transcodeClient = {
  async submitJob(ossObject) {
      let request = new $mts20140618.SubmitJobsRequest({
          input: inputParam(ossObject),
          outputs: outputParam(ossObject),
          outputBucket: bucket,
          pipelineId: pipelineId,
          outputLocation: ossLocation
      });
      let response = await client.submitJobs(request);
      if (response.body.jobResultList && response.body.jobResultList.jobResult && response.body.jobResultList.jobResult[0]) {
        return response.body.jobResultList.jobResult[0].job.jobId
      } else {
        return ''
      }
  },
  async queryJob(id) {
    let response = await client.queryJobList({jobIds: id})
    if (response.body.jobList && response.body.jobList.job && response.body.jobList.job[0].percent) {
      if (response.body.jobList.job[0].percent == 100) {
        return {
          percent: response.body.jobList.job[0].percent,
          url: ossUrl+response.body.jobList.job[0].output.outputFile.object
        }
      } else {
        return {
          percent: response.body.jobList.job[0].percent
        }
      }
    }
  }
}

// transcodeClient.submitJob("test/abc.ogg");

// transcodeClient.queryJob('40dd033f5e3b4f659ab230f5bdf32fa7')

module.exports = transcodeClient