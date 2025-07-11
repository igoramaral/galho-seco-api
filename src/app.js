require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const swaggerUI = require('swagger-ui-express');
const swaggerSpec = require('./swagger')
const bodyParser = require('body-parser');

//Importing Routes
const userRoutes = require('./routes/userRoutes');
const authRoutes = require('./routes/authRoutes');
const characterRoutes = require('./routes/characterRoutes');
const itemRoutes = require('./routes/itemRoutes');

// initializing the application
const app = express();
// app.use(express.json());
app.use(bodyParser.json({limit: '2mb'}))

//swagger documnentation
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec,{
  swaggerOptions: {
    defaultModelsExpandDepth: -1 // hides Schema section
  }
}));

// routing path
app.use('/api/v1', userRoutes);
app.use('/api/v1', authRoutes);
app.use('/api/v1', characterRoutes);
app.use('/api/v1', itemRoutes);

// Start the server
mongoose
  .connect(process.env.dbURL)
  .then((result) => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, "0.0.0.0", () => {
      console.log('Server started on port ', process.env.PORT);
    });
  })
  .catch((err) => {
    console.error('Could not connect to MongoDB:', err);
  });