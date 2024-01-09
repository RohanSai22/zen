const express = require('express');
const router = express.Router();
const Transaction = require('./model');
const excel = require('excel4node');

// Route to add a new transaction
router.post('/addTransaction', async (req, res) => {
  try {
    const { userId, description, transactionType, accountType } = req.body;

    // Logic to generate s.no (starting from 1 and increments by 2)
    // You may use a variable or retrieve this value from the database

    const newTransaction = new Transaction({
      userId: userId,
      description: description,
      transactionType: transactionType,
      accountType: accountType,
      // Add other required fields here
    });

    await newTransaction.save();

    // Generate Excel sheet for the user
    const workbook = new excel.Workbook();
    const worksheet = workbook.addWorksheet('Transactions');

    // Define columns
    worksheet.cell(1, 1).string('Serial No.');
    worksheet.cell(1, 2).string('Description');
    worksheet.cell(1, 3).string('Transaction Type');
    worksheet.cell(1, 4).string('Account Type');

    // Get all transactions for the user
    const userTransactions = await Transaction.find({ userId: userId });

    let row = 2;
    let serialNo = 1;

    // Add transactions to Excel sheet
    userTransactions.forEach((transaction) => {
      worksheet.cell(row, 1).number(serialNo);
      worksheet.cell(row, 2).string(transaction.description);
      worksheet.cell(row, 3).string(transaction.transactionType);
      worksheet.cell(row, 4).string(transaction.accountType);

      if (transaction.transactionType === 'Debit') {
        // If Debit transaction, add a corresponding Credit transaction
        worksheet.cell(row + 1, 1).number(serialNo + 1);
        worksheet.cell(row + 1, 2).string(transaction.description);
        worksheet.cell(row + 1, 3).string('Credit');
        worksheet.cell(row + 1, 4).string(transaction.accountType);

        row += 2;
        serialNo += 2;
      } else if (transaction.transactionType === 'Credit') {
        // If Credit transaction, add a corresponding Debit transaction
        worksheet.cell(row + 1, 1).number(serialNo + 1);
        worksheet.cell(row + 1, 2).string(transaction.description);
        worksheet.cell(row + 1, 3).string('Debit');
        worksheet.cell(row + 1, 4).string(transaction.accountType);

        row += 2;
        serialNo += 2;
      } else {
        row++;
        serialNo += 2;
      }
    });

    const filePath = `user_${userId}_transactions.xlsx`; // File name for the user's transactions

    workbook.write(filePath, (err, stats) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error generating Excel file' });
      } else {
        console.log('Excel file created successfully');
        res.status(200).json({ message: 'Excel file created successfully', filePath });
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
