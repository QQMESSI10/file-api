const jwt = require('jsonwebtoken')
const secretkey = 'qinxiangfile'

const signToken = (data = {}) => {
  return jwt.sign(data, secretkey, {
    expiresIn: 60 * 60
  })
}

const verifyToken = (req, res, next) => {
  let token = req.headers.token
  if (token) {
    jwt.verify(token, secretkey, (error, data) => {
      if (error) {
        console.log(error)
        res.send({ code: 2, msg: '当前登录已过期，请重新登录' });
      } else {
        const { iat, exp, ...info } = data
        req._user = info
        res.setHeader('token', signToken(info))
        next();
      }
    })
  } else {
    res.send({code: 2, msg: '未登录，请先登录'})
  }
}

module.exports = {
  signToken,
  verifyToken
}