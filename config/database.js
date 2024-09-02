const {Sequelize} = require('sequelize');

const sequelize = new Sequelize('finance_tracker', 'root', 'admin', {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        decimalNumbers: true
    }
});

module.exports = sequelize;