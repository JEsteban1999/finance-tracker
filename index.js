const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sequelize = require('./config/database');
const transactionRoutes = require('./routes/transactionRoutes');

const PORT = process.env.PORT || 3000;

const app = express();

app.use(cors());

app.use(bodyParser.json());

app.use('/transactions', transactionRoutes);

sequelize.sync().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch(error => console.log('Database connection failed: ', error));