const express = require('express');
const userController = require('../controllers/userController');
const userService = require('../services/userService');

const router = express.Router();

// Definindo as rotas
router.post('/user', userController.createUser);
router.get('/users/', userController.getUsers);
router.get('/user/:id', userController.getUser);
router.put('/user/:id', userController.updateUser);
router.delete('/user/:id', userController.deleteUser);

module.exports = router;
