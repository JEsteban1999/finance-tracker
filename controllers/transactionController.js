const Transaction = require('../models/Transaction');

exports.createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll();
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.getSummary = async (req, res) => {
    try {
        const summary = await Transaction.findAll({
            attributes: ['type', [sequelize.fn('sum', sequelize.col('amount')), 'total']],
            group: ['type']
        });
        res.status(200).json(summary);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({message: 'Transaction not found'});
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({message: 'Transaction not found'});
        }
        await transaction.update(req.body);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({error: error.message});
    }
};

exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({message: 'Transaction not found'});
        }
        await transaction.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(500).json({error: error.message});
    }
}

exports.getByCategory = async (req, res) => {

}

exports.getByDate = async (req, res) => {

}

exports.getCategories = async (req, res) => {

}