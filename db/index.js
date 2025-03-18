const { logger } = require('../utils/utils')

// sequelize连接mysql
const { Sequelize } = require('sequelize');

const sequelize = new Sequelize("filetest", "root", "b675b7c86d787eca", {
  host: "59.110.218.237",
  dialect: "mysql",
  dialectOptions: {
    idleTimeout: 20000,
  },
  define: {
    freezeTableName: true,
  },
  logging: (...msg) => {
    logger("warn", msg[0] + "------------" + msg[1].bind, "SQL语句");
  },
  timezone: "+08:00",
});


async function tryConnect() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}
tryConnect()

module.exports = sequelize