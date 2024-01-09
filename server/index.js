const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/userRoutes.js');
const key='mongodb+srv://rohansai:rohansai@cluster0.qsnqdoc.mongodb.net/?retryWrites=true&w=majority';
const app = express();

// Connect to MongoDB database (replace 'mongodb://localhost:27017/your_db_name' with your MongoDB connection string)
mongoose.connect(key, {
  serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds attempting to connect (optional but recommended)
  
})
.then(() => {
    console.log('Connected to MongoDB Run Hello Iam me');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err.message);
});

app.use('/addtransaction');
// Middleware to parse JSON body
app.use(express.json());

app.get('/hello',(req,res)=>{
  res.json({hi :'hello'})
})

// Routes
app.use(userRoutes);

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
