const bcrypt = require('bcryptjs')

const Application = require('../db/model/application')
const User = require('../db/model/user')
const Version = require('../db/model/version')
const Record = require('../db/model/record')
const Code = require('../db/model/code')
const Mail = require('../mail/mail')
const { signToken } = require('../utils/token')
const ossClient = require('../oss/index')

const apply = async (req, res) => {
  const form = req.body.form
  let checkAccount = true
  const disabledAccount = ["/", "\\", "|", "?", "*", ":", "'", "<", ">"]
  disabledAccount.forEach(e => {
    if (form.account.indexOf(e) != -1) {
      checkAccount = false
    }
  })
  if (!checkAccount) {
    res.send({code: 1, msg: "账号中不能包含/ \\ | ? * : ' < >等特殊字符"})
    return
  }
  const codeCheck = await Code.findOne({where: {email: form.email}})
  if (!codeCheck || codeCheck.code != form.code) {
    res.send({code: 1, msg: "邮箱验证码错误"})
    return
  }
  User.findOne({
    where: {
      account: form.account
    }
  }).then(userFind => {
    if (userFind) {
      res.send({code: 1, msg: '该账号已被注册'})
      return
    }
    Application.findAll({
      where: {
        account: form.account
      }
    }).then(applyFind => {
      if (applyFind.length > 0 && applyFind.find(f => f.state == 0)) {
        res.send({code: 1, msg: '该账号已被申请且正在审批中，请耐心等待'})
        return
      }
      const salt = bcrypt.genSaltSync(10)
      const hashPassword = bcrypt.hashSync(form.password, salt)
      if (form.account == 'qinxiang') {
        User.create({
          account: form.account,
          name: form.userName,
          email: form.email,
          password: hashPassword,
          isAdmin: true
        }).then(() => {
          res.send({code: 0, msg: '你牛逼，你可以登录了'})
        }).catch(err => {console.log(err)})
        return
      }
      Application.create({
        account: form.account,
        name: form.userName,
        email: form.email,
        password: hashPassword,
        state: 0
      }).then(() => {
        res.send({code: 0, msg: '稍后审核结果将以邮件形式发送，请注意查收'})
        Mail.sendMail({
          email: '15163281896@163.com',
          subject: '新的账号申请待审核',
          content: `<p><span style="font-weight:bold">QQMESSI FS</span>有新的账号申请待审核，请尽快进行审核，不然开除你</p>
          <a href='https://file.qinxiang.cc/#/'>点击前往审核</a>`
        })
      }).catch(err => console.log(err))
    }).catch(err => console.log(err))
  }).catch(err => console.log(err))
}

const login = (req, res) => {
  const form = req.body.form
  User.findOne({
    where: {
      account: form.account,
    }
  }).then((user) => {
    if (user) {
      const checkPsw = bcrypt.compareSync(form.password, user.password)
      if (checkPsw) {
        const info = {
          account: user.account,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
        }
        Record.findOne({
          where: {
            account: user.account
          }
        }).then(rec => {
          let userHasRecord = false
          if (rec) {
            userHasRecord = true
            info.lastVersion = rec.version
          }
          const token = signToken(info)
          res.setHeader('token', token)
          res.send({ code: 0, msg: '登录成功', data: info })
          // Version.findAll().then(verArr => {
          //   const newVersion = verArr.reduce((prev, current) => (prev.number > current.number ? prev : current)).number
          //   if (userHasRecord) {
          //     Record.update({version: newVersion}, {where: {account: user.account}})
          //   } else {
          //     Record.create({
          //       account: user.account,
          //       version: newVersion
          //     })
          //   }
          // })
        }).catch(err => console.log(err))
      } else {
        res.send({code: 1, msg: '账号或密码输入错误'})
      }
    } else {
      Application.findAll({
        where: {
          account: form.account
        }
      }).then(apply => {
        if (apply.length > 0) {
          if (apply.find(f => f.state == 0)) {
            res.send({code: 1, msg: '该账号申请还在审核中，请耐心等待'})
          } else {
            const applyFailed = apply.filter(f => f.state == 2)
            applyFailed.sort((a,b) => {
              return b.updatedAt - a.updatedAt
            })
            res.send({code: 1, msg: `该账号申请审核未通过，原因是：${applyFailed[0].reason}`})
          }
        } else {
          res.send({code: 1, msg: '该账号尚未进行注册，请确认账号是否输入正确'})
        }
      }).catch(err => console.log(err))
    }
  }).catch(err => console.log(err))
}

const checkToken = (req, res) => {
  res.send({})
}

const applyList = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
  } else {
    Application.findAll({
      where: {
        state: 0
      }
    }).then(apply => {
      res.send({code: 0, data: apply})
    }).catch(err => console.log(err))
  }
}

const allApply = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
  } else {
    Application.findAll().then(apply => {
      res.send({code: 0, data: apply})
    }).catch(err => console.log(err))
  }
}

const applyFail = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
    return
  }
  if (req.body.id) {
    Application.update({state: 2, reason: req.body.reason}, {where: {id: req.body.id}}).then(() => {
      res.send({code: 0})
      Mail.sendMail({
          email: req.body.email,
          subject: '账号审核未通过',
          content: `<p>您申请的 QQMESSI FS "${req.body.account}"账号审核未通过,原因是：${req.body.reason}。如非本人操作，请忽略</p>
          <a href='https://file.qinxiang.cc/#/'>点击进入系统</a>`
      })
    }).catch(err => {console.log(err)})
  } else {
    res.send({code: 1, msg: '操作失败'})
  }
}

const applyPass = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
    return
  }
  if (req.body.id) {
    Application.update({state: 1}, {where: {id: req.body.id}}).then(() => {
      Application.findOne({where: {id: req.body.id}}).then(applyRes => {
        const { account, name, email, password } = applyRes
        User.create({ account, name, email, password }).then(() => {
          res.send({code: 0})
          Mail.sendMail({
            email: req.body.email,
            subject: '账号审核已通过',
            content: `<p>您申请的 QQMESSI FS "${account}"账号审核已通过。如非本人操作，请忽略</p>
            <a href='https://file.qinxiang.cc/#/'>点击进入系统</a>`
          })
          ossClient.put(account + '/', Buffer.from(''))
        }).catch(err => {console.log(err)})
      }).catch(err => {console.log(err)})
    }).catch(err => {console.log(err)})
  } else {
    res.send({code: 1, msg: '操作失败'})
  }
}

const releaseVersion = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
    return
  }
  const {number, content} = req.body
  Version.create({number, content}).then(() => {
    res.send({code: 0, msg: '发布成功'})
  }).catch(err => {console.log(err)})
}

const getNewVersion = (req, res) => {
  Version.findAll().then(verArr => {
    if (verArr.length > 0) {
      const newVersion = verArr[verArr.length - 1].number
      Record.findOne({where: {account: req._user.account, version: newVersion}}).then(rec => {
        if (rec) {
          res.send({code: 0, msg: '已是最新版本'})
        } else {
          res.send({code: 0, data: verArr[verArr.length - 1]})
        }
      }).catch(err => console.log(err))
    } else {
      res.send({code: 1, msg: '未找到新版本'})
    }
  }).catch(err => console.log(err))
}

const startVersion = (req, res) => {
  if (req._user.account == 'test') {
    res.send({code : 0})
    return
  }
  Record.findOne({where: {account: req._user.account}}).then(rec => {
    if (rec) {
      Record.update({version: req.body.version}, {where: {account: req._user.account}}).then(() => {
        res.send({code: 0})
      }).catch(err => console.log(err))
    } else {
      Record.create({
        account: req._user.account,
        version: req.body.version
      }).then(() => {
        res.send({code: 0})
      }).catch(err => console.log(err))
    }
  })
}
const getVersionList = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
    return
  }
  Version.findAll().then(v => {
    res.send({code: 0, data: v})
  }).catch(err => console.log(err))
}
const editVersion = (req, res) => {
  if (!req._user.isAdmin) {
    res.send({code: 1, msg: '当前用户暂无权限'})
    return
  }
  Version.update({content: req.body.content}, {where: {number: req.body.number}}).then(ver => {
    res.send({code: 0, msg: '修改成功'})
  }).catch(err => console.log(err))
}

const getCode = (req, res) => {
  const email = req.body.email
  Code.findOne({where: {email}}).then(codeFind => {
    let str = "1234567890";
    let strCode = "";
    for (let i = 0; i < 6; i++) {
      let n = Math.floor(Math.random() * str.length);
      strCode += str[n];
    }
    if (codeFind) {
      Code.update({code: strCode}, {where: {email}}).then(() => {
        res.send({code: 0})
      }).catch(err => console.log(err))
    } else {
      Code.create({email, code: strCode}).then(() => {
        res.send({code: 0})
      }).catch(err => console.log(err))
    }
    Mail.sendMail({
      email,
      subject: 'QQMESSI FS 验证码',
      content: `<p>QQMESSI FS 验证码：<span style="font-size: 24px;font-weight: bold">${strCode}</span>。如非本人操作，请忽略</p>`
    })
  }).catch(err => console.log(err))
}

module.exports = {
  apply,
  login,
  checkToken,
  applyList,
  allApply,
  applyFail,
  applyPass,
  releaseVersion,
  getNewVersion,
  startVersion,
  getVersionList,
  editVersion,
  getCode
}