const { DataTypes } = require('sequelize');
const sequelize = require('../index')

const Application = sequelize.define('application', {
  account: {
    type: DataTypes.STRING(50)
  },
  name: {
    type: DataTypes.STRING(50)
  },
  email: {
    type: DataTypes.STRING(50)
  },
  password: {
    type: DataTypes.STRING(100)
  },
  state: {   // 0 待审核   1 审核通过   2 审核不通过
    type: DataTypes.INTEGER
  },
  reason: {
    type: DataTypes.STRING
  }
})

module.exports = Application