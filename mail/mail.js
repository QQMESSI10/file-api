const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  secure: false,
  auth: {
    user: "1032064476@qq.com",
    pass: "upsiymchpetzbbij",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function main(info) {
  // send mail with defined transport object
  const sendEmailInfo = await transporter.sendMail({
    from: '"QQMESSI FS" <1032064476@qq.com>', // sender address
    to: info.email, // list of receivers
    subject: info.subject, // Subject line
    html: info.content,
    // text: "", // plain text body
    // html: "<p>您有新的账号申请待审核，请尽快进行审核，不然开除你</p><a href='https://file.qinxiang.cc/#/'>点击前往审核</a>", // html body
  });

  console.log("邮件发送成功：", sendEmailInfo.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

exports.sendMail = (info) => {
  main(info).catch(console.error);
}