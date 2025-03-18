const { DataTypes } = require('sequelize');
const sequelize = require('../index');

const App = sequelize.define('app', {
  name: {
    type: DataTypes.STRING
  },
  icon: {
    type: DataTypes.STRING
  },
  key: {
    type: DataTypes.STRING
  },
  component: {
    type: DataTypes.STRING
  },
  style: {
    type: DataTypes.STRING
  },
  isAdminHas: {
    type: DataTypes.BOOLEAN
  }
})

module.exports = App