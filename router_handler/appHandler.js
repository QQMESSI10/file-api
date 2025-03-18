const App = require('../db/model/app')

exports.list = (req, res) => {
  let queryWhere = {}
  if (!req._user.isAdmin) {
    queryWhere = {
      isAdminHas: false
    }
  }
  App.findAll({
    where: queryWhere
  }).then(list => {
    res.send({code: 0, data: list})
  }).catch(err => console.log(err))
}