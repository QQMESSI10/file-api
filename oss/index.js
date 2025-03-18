const co = require('co');
const OSS = require('ali-oss')

const ossClient = new OSS({
  region: 'oss-cn-beijing',
  accessKeyId: 'LTAI5tBx2LmAirhodndr6Jnh',
  accessKeySecret: 'PvEhhNbYsRczA5fqHp45gbGkeVCQ9j',
  bucket: 'qin-file',
  endpoint: 'https://fileoss.qinxiang.cc',
  cname: true,
  secure: true
});

async function list () {
  // 不带任何参数，默认最多返回100个文件。
  const result = await ossClient.list();
  console.log('oss连接正常');
}

list()

module.exports = ossClient