# Finance Tracker API

This application provides a RESTful API for managing financial transactions. It includes functionality for creating, reading, updating, and deleting transactions, as well as filtering transactions by date and category. The API also includes endpoints for summarizing transactions and retrieving categories.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Error Handling](#error-handling)

## Features

- **Transaction Management**: Create, update, delete, and retrieve transactions.
- **Filtering**: Filter transactions by date range and category.
- **Summary**: Get a summary of total income, expenses, and net balance.
- **Categories**: Retrieve all unique categories from transactions.
- **Swagger Documentation**: Interactive API documentation.

## Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/JEsteban1999/finance-tracker.git
    ```

2. Navigate to the project directory:

    ```bash
    cd finance-tracker
    ```

3. Install dependencies:

    ```bash
    npm install
    ```
    
4. Start the server:

    ```bash
    npm run dev
    ```

## Usage

Once the server is running, you can interact with the API at `http://localhost:3000`.

To view the Swagger documentation, navigate to `http://localhost:3000/api-docs` in your web browser.

## API Endpoints

### Transactions

- **Create a Transaction**

    - `POST /transactions`
    - Request Body: 
      ```json
      {
        "date": "2024-09-01",
        "category": "Groceries",
        "amount": 50.00,
        "type": "Expense"
      }
      ```
    - Response: 
      ```json
      {
        "id": 1,
        "date": "2024-09-01",
        "category": "Groceries",
        "amount": 50.00,
        "type": "Expense"
      }
      ```

- **Get All Transactions**

    - `GET /transactions`
    - Response: 
      ```json
      [
        {
          "id": 1,
          "date": "2024-09-01",
          "category": "Groceries",
          "amount": 50.00,
          "type": "Expense"
        }
      ]
      ```

- **Get Transaction by ID**

    - `GET /transactions/{id}`
    - Response: 
      ```json
      {
        "id": 1,
        "date": "2024-09-01",
        "category": "Groceries",
        "amount": 50.00,
        "type": "Expense"
      }
      ```

- **Update a Transaction**

    - `PUT /transactions/{id}`
    - Request Body: 
      ```json
      {
        "date": "2024-09-02",
        "category": "Dining",
        "amount": 75.00,
        "type": "Expense"
      }
      ```
    - Response: 
      ```json
      {
        "id": 1,
        "date": "2024-09-02",
        "category": "Dining",
        "amount": 75.00,
        "type": "Expense"
      }
      ```

- **Delete a Transaction**

    - `DELETE /transactions/{id}`
    - Response: No content.

### Filtering and Summary

- **Get Transactions by Date Range**

    - `GET /transactions/by-date?startDate=2024-09-01&endDate=2024-09-30`
    - Response: 
      ```json
      [
        {
          "id": 1,
          "date": "2024-09-01",
          "category": "Groceries",
          "amount": 50.00,
          "type": "Expense"
        }
      ]
      ```

- **Get Transactions by Category**

    - `GET /transactions/by-category?categories=Groceries,Dining`
    - Response: 
      ```json
      [
        {
          "id": 1,
          "date": "2024-09-01",
          "category": "Groceries",
          "amount": 50.00,
          "type": "Expense"
        }
      ]
      ```

- **Get Summary**

    - `GET /summary?startDate=2024-09-01&endDate=2024-09-30`
    - Response: 
      ```json
      {
        "totalIncome": 500.00,
        "totalExpenses": 150.00,
        "netBalance": 350.00
      }
      ```

- **Get Categories**

    - `GET /categories`
    - Response: 
      ```json
      [
        "Groceries",
        "Dining",
        "Utilities"
      ]
      ```

## Error Handling

- **400 Bad Request**: The request was invalid or missing required parameters.
- **404 Not Found**: The requested resource was not found.
- **500 Internal Server Error**: An error occurred on the server.
