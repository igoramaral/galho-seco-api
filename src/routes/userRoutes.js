const express = require('express');
const userController = require('../controllers/userController');

const router = express.Router();

// Definindo as rotas
router.post('/user', userController.createUser);
router.get('/users', userController.getUsers);

module.exports = router;
