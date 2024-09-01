const {DataTypes} = require('sequelize');
const sequelize = require('../config/database');

const Transaction = sequelize.define('Transaction', {
    type: {
        type: DataTypes.ENUM('Income', 'Expense'),
        allowNull: false
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    category: {
        type: DataTypes.STRING,
        allowNull: false
    },
    date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT
    }
}, {
    sequelize,
    modelName: 'Transaction',
    timestamps: false
});

module.exports = Transaction;