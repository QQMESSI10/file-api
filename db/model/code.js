const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const Code = sequelize.define('code', {
  email: {
    type: DataTypes.STRING(50)
  },
  code: {
    type: DataTypes.STRING(20)
  }
})

module.exports = Code