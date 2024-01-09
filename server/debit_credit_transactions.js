const excel = require('excel4node');
const XLSX = require('xlsx');

// Load the Excel file containing transaction data
const workbook = XLSX.readFile('path/to/transactions.xlsx'); // Replace with the path to your Excel file
const sheetName = workbook.SheetNames[0]; // Assuming data is on the first sheet
const worksheet = workbook.Sheets[sheetName];

// Parse transaction data from the Excel sheet
const transactionData = XLSX.utils.sheet_to_json(worksheet);

// Separate debit and credit transactions
const debitTransactions = transactionData.filter(transaction => transaction['Type of Transaction'] === 'Debit');
const creditTransactions = transactionData.filter(transaction => transaction['Type of Transaction'] === 'Credit');

// Perform calculations for Trial Balance
const trialBalance = {};

debitTransactions.forEach((transaction) => {
  if (!trialBalance[transaction['Type of Account']]) {
    trialBalance[transaction['Type of Account']] = transaction['Amount'];
  } else {
    trialBalance[transaction['Type of Account']] += transaction['Amount'];
  }
});

creditTransactions.forEach((transaction) => {
  if (!trialBalance[transaction['Type of Account']]) {
    trialBalance[transaction['Type of Account']] = -transaction['Amount'];
  } else {
    trialBalance[transaction['Type of Account']] -= transaction['Amount'];
  }
});

// Perform calculations for Balance Sheet (Assets and Liabilities)
const balanceSheet = {
  assets: {},
  liabilities: {},
};

transactionData.forEach((transaction) => {
  if (transaction['Type of Account'] === 'Asset') {
    if (!balanceSheet.assets[transaction['Description']]) {
      balanceSheet.assets[transaction['Description']] = transaction['Amount'];
    } else {
      balanceSheet.assets[transaction['Description']] += transaction['Amount'];
    }
  } else if (transaction['Type of Account'] === 'Liability') {
    if (!balanceSheet.liabilities[transaction['Description']]) {
      balanceSheet.liabilities[transaction['Description']] = transaction['Amount'];
    } else {
      balanceSheet.liabilities[transaction['Description']] += transaction['Amount'];
    }
  }
});

// Perform calculations for Profit & Loss Account (Income Statement)
const incomeStatement = {};

transactionData.forEach((transaction) => {
  if (!incomeStatement[transaction['Description']]) {
    incomeStatement[transaction['Description']] = (transaction['Type of Transaction'] === 'Debit')
      ? transaction['Amount']
      : -transaction['Amount'];
  } else {
    incomeStatement[transaction['Description']] += (transaction['Type of Transaction'] === 'Debit')
      ? transaction['Amount']
      : -transaction['Amount'];
  }
});

// Create a new Excel workbook to write financial statements
const wb = new excel.Workbook();
const ws = wb.addWorksheet('Financial Statements');

// Write Trial Balance to Excel
let row = 1;
ws.cell(row, 1).string('Trial Balance');
row += 1;
Object.entries(trialBalance).forEach(([accountType, amount]) => {
  ws.cell(row, 1).string(accountType);
  ws.cell(row, 2).number(amount);
  row += 1;
});

// Write Balance Sheet to Excel
row += 2; // Skip some rows for separation
ws.cell(row, 1).string('Balance Sheet');
row += 1;
ws.cell(row, 1).string('Assets');
row += 1;
Object.entries(balanceSheet.assets).forEach(([asset, amount]) => {
  ws.cell(row, 1).string(asset);
  ws.cell(row, 2).number(amount);
  row += 1;
});
row += 1;
ws.cell(row, 1).string('Liabilities');
row += 1;
Object.entries(balanceSheet.liabilities).forEach(([liability, amount]) => {
  ws.cell(row, 1).string(liability);
  ws.cell(row, 2).number(amount);
  row += 1;
});

// Write Profit & Loss Account to Excel
row += 2; // Skip some rows for separation
ws.cell(row, 1).string('Profit & Loss Account');
row += 1;
Object.entries(incomeStatement).forEach(([description, amount]) => {
  ws.cell(row, 1).string(description);
  ws.cell(row, 2).number(amount);
  row += 1;
});

// Save the workbook with financial statements to a new Excel file
wb.write('path/to/financial_statements.xlsx', (err, stats) => {
  if (err) {
    console.error(err);
  } else {
    console.log('Financial statements generated successfully!');
  }
});
