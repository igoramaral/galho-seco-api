require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

//Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');

// initializing the application
const app = express();
app.use(express.json());

// 

// routing path
app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', characterRoutes);

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