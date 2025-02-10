require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//Routes
const userRoutes = require('./routes/userRoutes');

// initializing the application
const app = express();
app.use(express.json());

// 

// routing path
app.use('/api/v1', userRoutes);

// Start the server
mongoose
  .connect(process.env.dbURL)
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log('Server started on port ', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
  });