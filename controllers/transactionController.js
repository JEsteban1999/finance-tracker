const Transaction = require('../models/Transaction');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       required:
 *         - date
 *         - category
 *         - amount
 *         - type
 *       properties:
 *         id:
 *           type: integer
 *           description: ID autogenerado de la transacción
 *           example: 1
 *         date:
 *           type: string
 *           format: date
 *           description: Fecha de la transacción
 *           example: "2024-09-01"
 *         category:
 *           type: string
 *           description: Categoría de la transacción
 *           example: "Food"
 *         amount:
 *           type: number
 *           description: Monto de la transacción
 *           example: 25.99
 *         type:
 *           type: string
 *           description: Tipo de la transacción
 *           enum:
 *             - Income
 *             - Expense
 *           example: "Expense"
 *         description:
 *           type: string
 *           description: Descripción adicional de la transacción
 *           example: "Compra de comestibles"
 */

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     description: Create a new financial transaction with the provided details.
 *     tags:
 *       - Transactions
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               amount:
 *                 type: number
 *                 description: The amount of the transaction.
 *                 example: 100.50
 *               type:
 *                 type: string
 *                 description: The type of the transaction (e.g., Income, Expense).
 *                 example: Income
 *               category:
 *                 type: string
 *                 description: The category of the transaction (e.g., Salary, Food).
 *                 example: Salary
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the transaction.
 *                 example: 2024-09-02
 *     responses:
 *       201:
 *         description: Transaction created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request. The input data is invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Validation error: amount is required."
 */
exports.createTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.create(req.body);
        res.status(201).json(transaction);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Retrieve a paginated list of transactions
 *     description: Fetches a paginated list of transactions. Supports pagination via query parameters `page` and `pageSize`.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           example: 1
 *         description: The page number to retrieve.
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *           example: 10
 *         description: The number of transactions to retrieve per page.
 *     responses:
 *       200:
 *         description: A paginated list of transactions.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedTransactions'
 *       400:
 *         description: Invalid pagination parameters.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid pagination parameters"
 *       500:
 *         description: Server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal server error"
 */
exports.getAllTransactions = async (req, res) => {
    try {
        // Obtener los parámetros de paginación de la consulta
        const { page = 1, pageSize = 10 } = req.query;
        
        // Validar que los parámetros de paginación sean números
        const pageNumber = parseInt(page, 10);
        const pageSizeNumber = parseInt(pageSize, 10);

        if (isNaN(pageNumber) || isNaN(pageSizeNumber) || pageNumber < 1 || pageSizeNumber < 1) {
            return res.status(400).json({ error: 'Invalid pagination parameters' });
        }

        // Calcular el offset para la paginación
        const offset = (pageNumber - 1) * pageSizeNumber;

        // Obtener las transacciones con paginación
        const transactions = await Transaction.findAll({
            limit: pageSizeNumber,
            offset: offset
        });

        // Obtener el total de transacciones para la paginación
        const totalTransactions = await Transaction.count();

        // Devolver las transacciones y la información de paginación
        res.status(200).json({
            total: totalTransactions,
            page: pageNumber,
            pageSize: pageSizeNumber,
            transactions
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


/**
 * @swagger
 * /transactions/summary:
 *   get:
 *     summary: Get a summary of transactions within a date range
 *     description: Retrieve the total income, total expenses, and net balance for transactions within a specific date range. Useful for budgeting and financial analysis.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: The start date of the range in YYYY-MM-DD format.
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: The end date of the range in YYYY-MM-DD format.
 *     responses:
 *       200:
 *         description: A summary of income, expenses, and net balance.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalIncome:
 *                   type: number
 *                   description: The total income within the specified date range.
 *                   example: 5000
 *                 totalExpenses:
 *                   type: number
 *                   description: The total expenses within the specified date range.
 *                   example: 3000
 *                 netBalance:
 *                   type: number
 *                   description: The net balance (total income - total expenses).
 *                   example: 2000
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred."
 */
exports.getSummary = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Crear el filtro de fecha si los parámetros están presentes
        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                date: {
                    [Op.between]: [new Date(startDate), new Date(endDate)]
                }
            };
        } else if (startDate) {
            dateFilter = {
                date: {
                    [Op.gte]: new Date(startDate)
                }
            };
        } else if (endDate) {
            dateFilter = {
                date: {
                    [Op.lte]: new Date(endDate)
                }
            };
        }

        // Obtener la suma de todos los ingresos (Income) filtrados por fecha
        const totalIncome = await Transaction.sum('amount', {
            where: {
                type: 'Income',
                ...dateFilter
            }
        });

        // Obtener la suma de todos los gastos (Expense) filtrados por fecha
        const totalExpenses = await Transaction.sum('amount', {
            where: {
                type: 'Expense',
                ...dateFilter
            }
        });

        // Calcular el balance neto
        const netBalance = (totalIncome || 0) - (totalExpenses || 0);

        // Devolver el resumen
        res.status(200).json({
            totalIncome: totalIncome || 0,
            totalExpenses: totalExpenses || 0,
            netBalance
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /transactions/by-category:
 *   get:
 *     summary: Retrieve transactions filtered by specific categories
 *     description: Fetches transactions that match the specified categories. Categories should be passed as a comma-separated list in the query parameter.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: categories
 *         description: A comma-separated list of categories to filter transactions by.
 *         required: true
 *         schema:
 *           type: string
 *           example: "Food,Entertainment,Utilities"
 *     responses:
 *       200:
 *         description: Successfully retrieved the transactions filtered by categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request if no categories are provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Categories parameter is required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred."
 */
exports.getByCategory = async (req, res) => {
    const categories = req.query.categories ? req.query.categories.split(',') : [];

    try {
        const transactions = await Transaction.findAll({
            where: {
                category: categories
            }
        });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /transactions/by-date:
 *   get:
 *     summary: Retrieve transactions within a specific date range
 *     description: Fetches transactions that fall within the specified date range. Both `startDate` and `endDate` are required query parameters.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: query
 *         name: startDate
 *         description: The start date of the range to filter transactions.
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-01-01"
 *       - in: query
 *         name: endDate
 *         description: The end date of the range to filter transactions.
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *           example: "2024-12-31"
 *     responses:
 *       200:
 *         description: Successfully retrieved transactions within the specified date range.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transaction'
 *       400:
 *         description: Bad request if `startDate` or `endDate` are missing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Both startDate and endDate are required"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred."
 */
exports.getByDate = async (req, res) => {
    const { startDate, endDate } = req.query;

    try {
        // Validación de las fechas
        if (!startDate || !endDate) {
            return res.status(400).json({ error: "Both startDate and endDate are required" });
        }

        const transactions = await Transaction.findAll({
            where: {
                date: {
                    [Op.between]: [startDate, endDate]
                }
            }
        });

        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /transactions/categories:
 *   get:
 *     summary: Retrieve all unique transaction categories
 *     description: Fetches a list of all unique categories from transactions. This helps ensure consistency in categorization across the application.
 *     tags:
 *       - Transactions
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *                 description: The name of the category.
 *                 example: "Food"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred."
 */
exports.getCategories = async (req, res) => {
    try {
        // Obtener todas las categorías distintas de las transacciones
        const categories = await Transaction.findAll({
            attributes: [
                [sequelize.fn('DISTINCT', sequelize.col('category')), 'category']
            ],
            order: [['category', 'ASC']]
        });

        // Mapea solo los nombres de las categorías
        const categoryList = categories.map(category => category.category);

        res.status(200).json(categoryList);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Retrieve a transaction by its ID
 *     description: Fetches the details of a specific transaction using its unique ID.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The unique identifier of the transaction to retrieve.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       200:
 *         description: Successfully retrieved the transaction.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred."
 */
exports.getTransactionById = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /transactions/{id}:
 *   put:
 *     summary: Update a transaction by ID
 *     description: Updates an existing transaction identified by its ID. The request body should contain the updated transaction details.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to update.
 *         schema:
 *           type: integer
 *           example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *                 description: The date of the transaction.
 *                 example: "2024-09-02"
 *               category:
 *                 type: string
 *                 description: The category of the transaction.
 *                 example: "Food"
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount of the transaction.
 *                 example: 100.50
 *               type:
 *                 type: string
 *                 description: The type of the transaction (e.g., Income, Expense).
 *                 example: "Expense"
 *     responses:
 *       200:
 *         description: Successfully updated the transaction.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: integer
 *                   description: The ID of the transaction.
 *                   example: 1
 *                 date:
 *                   type: string
 *                   format: date
 *                   description: The date of the transaction.
 *                   example: "2024-09-02"
 *                 category:
 *                   type: string
 *                   description: The category of the transaction.
 *                   example: "Food"
 *                 amount:
 *                   type: number
 *                   format: float
 *                   description: The amount of the transaction.
 *                   example: 100.50
 *                 type:
 *                   type: string
 *                   description: The type of the transaction (e.g., Income, Expense).
 *                   example: "Expense"
 *       400:
 *         description: Bad request if the request body is invalid or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Invalid request body"
 *       404:
 *         description: Transaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred."
 */
exports.updateTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.update(req.body);
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     description: Deletes a transaction identified by its ID. If the transaction is not found, a 404 error is returned. If successful, no content is returned.
 *     tags:
 *       - Transactions
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the transaction to delete.
 *         schema:
 *           type: integer
 *           example: 1
 *     responses:
 *       204:
 *         description: Successfully deleted the transaction. No content is returned.
 *       404:
 *         description: Transaction not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Transaction not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Database error occurred."
 */
exports.deleteTransaction = async (req, res) => {
    try {
        const transaction = await Transaction.findByPk(req.params.id);
        if (!transaction) {
            return res.status(404).json({ message: 'Transaction not found' });
        }
        await transaction.destroy();
        res.status(204).json();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}
