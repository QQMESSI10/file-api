const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Version = sequelize.define('version', {
  number: {
    type: DataTypes.STRING(50),
  },
  content: {
    type: DataTypes.STRING(1234)
  }
})

module.exports = Version