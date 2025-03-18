const Client = require('@alicloud/docmind-api20220711');
const Util = require('@alicloud/tea-util');
const fs = require('fs');
const config = require("../config/config")

const client = new Client.default({
  // 访问的域名，支持ipv4和ipv6两种方式，ipv6请使用docmind-api-dualstack.cn-hangzhou.aliyuncs.com
  endpoint: 'docmind-api.cn-hangzhou.aliyuncs.com',
  // 通过credentials获取配置中的AccessKey ID
  accessKeyId: config.accessKeyId,
  // 通过credentials获取配置中的AccessKey Secret
  accessKeySecret: config.accessKeySecret,
  type: 'access_key',
  regionId: 'cn-hangzhou'
});

const pdfTowordSubmit = async (fileUrl) => {
  const advanceRequest = new Client.SubmitConvertPdfToWordJobAdvanceRequest();
  const file = fs.createReadStream(fileUrl);
  advanceRequest.fileUrlObject = file;
  const fileSplit = fileUrl.split('/')
  advanceRequest.fileName = fileSplit[fileSplit.length - 1];
  const runtimeObject = new Util.RuntimeOptions({});
  const response = await client.submitConvertPdfToWordJobAdvance(advanceRequest, runtimeObject);
	return response.body;
}

const pdfToexcelSubmit = async (fileUrl) => {
  const advanceRequest = new Client.SubmitConvertPdfToExcelJobAdvanceRequest();
  const file = fs.createReadStream(fileUrl);
  advanceRequest.fileUrlObject = file;
  const fileSplit = fileUrl.split('/')
  advanceRequest.fileName = fileSplit[fileSplit.length - 1];
  const runtimeObject = new Util.RuntimeOptions({});
  const response = await client.submitConvertPdfToExcelJobAdvance(advanceRequest, runtimeObject);
	return response.body;
}

const pdfToimageSubmit = async (fileUrl) => {
  const advanceRequest = new Client.SubmitConvertPdfToImageJobAdvanceRequest();
  const file = fs.createReadStream(fileUrl);
  advanceRequest.fileUrlObject = file;
  const fileSplit = fileUrl.split('/')
  advanceRequest.fileName = fileSplit[fileSplit.length - 1];
  const runtimeObject = new Util.RuntimeOptions({});
  const response = await client.submitConvertPdfToImageJobAdvance(advanceRequest, runtimeObject);
	return response.body;
}

const imageToWordSubmit = async (fileUrl) => {
  const advanceRequest = new Client.SubmitConvertImageToWordJobRequest();
  advanceRequest.imageUrls = [ fileUrl ];
  const fileArr = fileUrl.split('.')
  advanceRequest.imageNameExtension = fileArr[fileArr.length - 1];
  const response = await client.submitConvertImageToWordJob(advanceRequest);
	return response.body;
}

const imageToExcelSubmit = async (fileUrl) => {
  const advanceRequest = new Client.SubmitConvertImageToExcelJobRequest();
  advanceRequest.imageUrls = [ fileUrl ];
  const fileArr = fileUrl.split('.')
  advanceRequest.imageNameExtension = fileArr[fileArr.length - 1];
  const response = await client.submitConvertImageToExcelJob(advanceRequest);
	return response.body;
}

const imageToPdfSubmit = async (fileUrl) => {
  const advanceRequest = new Client.SubmitConvertImageToPdfJobRequest();
  advanceRequest.imageUrls = [ fileUrl ];
  const fileArr = fileUrl.split('.')
  advanceRequest.imageNameExtension = fileArr[fileArr.length - 1];
  const response = await client.submitConvertImageToPdfJob(advanceRequest);
	return response.body;
}

const getResult = async (id) => {
  const resultRequest = new Client.GetDocumentConvertResultRequest();
  resultRequest.id = id;
  const response = await client.getDocumentConvertResult(resultRequest);
  return response.body;
}

const documentConvert = {
  pdfTowordSubmit,
  pdfToexcelSubmit,
  pdfToimageSubmit,
  imageToWordSubmit,
  imageToExcelSubmit,
  imageToPdfSubmit,
  getResult
}

module.exports = documentConvert