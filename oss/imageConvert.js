const OSS = require('ali-oss');
const config = require("../config/config")

const client = new OSS({
  // yourregion填写Bucket所在地域。以华东1（杭州）为例，Region填写为oss-cn-hangzhou。
  region: config.region,
  // 从环境变量中获取访问凭证。运行本代码示例之前，请确保已设置环境变量OSS_ACCESS_KEY_ID和OSS_ACCESS_KEY_SECRET。
  accessKeyId: config.accessKeyId,
  accessKeySecret: config.accessKeySecret,
  // yourbucketname填写存储空间名称。
  bucket: config.bucket
});

// 将图片缩放为固定宽高100 px。
async function scale() {
  try {
    const result = await client.get('example.jpg', './example-resize.jpg', { process: 'image/resize,m_fixed,w_100,h_100'});
  } catch (e) {
    console.log(e);
  }
}

// scale()

// 从坐标（100,100）开始，将图片裁剪为宽高100 px。
async function cut() {
  try {
     const result = await client.get('example.jpg', './example-crop.jpg', { process: 'image/crop,w_100,h_100,x_100,y_100,r_1'});
  } catch (e) {
    console.log(e)
  }
}

// cut()

// 将图片旋转90°。
async function rotate() {
  try {
    const result = await client.get('example.jpg', './example-rotate.jpg', { process: 'image/rotate,90'});
  } catch (e) {
    console.log(e);
  }
}

// rotate()

// 将图片进行锐化，锐化参数为100。
async function sharpen() {
  try {
    const result = await client.get('example.jpg', './example-sharpen.jpg', { process: 'image/sharpen,100'});
  } catch (e) {
    console.log(e);
  }
}

// sharpen()

// 在图片中添加水印。
async function watermark() {
  try {
    const result = await client.get('example.jpg', './example-watermark.jpg', { process: 'image/watermark,text_SGVsbG8g5Zu-54mH5pyN5YqhIQ'});
  } catch (e) {
    console.log(e);
  }
}

// watermark()

// 将图片进行格式转换。
async function format(param) {
  try {
    const date = new Date().getTime()
    const tempFileUrl = `./tempFile/${date}.${param.type}`
    const result = await client.get(param.directory, tempFileUrl, { process: 'image/format,'+param.type});
    console.log(result)
    return {
      ...result.res,
      fileUrl: tempFileUrl
    }
  } catch (e) {
    console.log(e);
  }
}

// format()

// 获取图片信息。
async function info() {
  try {
    const result = await client.get('example.jpg', './example-info.txt', {process: 'image/info'});
  } catch (e) {
    console.log(e);
  }
}

// info()

const imageConvert = {
  scale,
  cut,
  rotate,
  sharpen,
  watermark,
  format,
  info
}

module.exports = imageConvert