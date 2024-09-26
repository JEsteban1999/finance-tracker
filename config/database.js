const {Sequelize} = require('sequelize');
require('dotenv').config({path: 'variables.env'});

console.log(process.env);

const sequelize = new Sequelize(process.env.DATABASE, process.env.USER, process.env.PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: {
        decimalNumbers: true
    }
});

module.exports = sequelize;