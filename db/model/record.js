const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Record = sequelize.define('record', {
  account: {
    type: DataTypes.STRING(50),
  },
  appData: {
    type: DataTypes.STRING
  },
  version: {
    type: DataTypes.STRING(50)
  }
})

module.exports = Record