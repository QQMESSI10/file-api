const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const User = sequelize.define('user', {
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
  isAdmin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
})

module.exports = User