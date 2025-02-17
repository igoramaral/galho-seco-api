const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Definindo as rotas
router.post('/user', userController.createUser);
router.get('/users/', userController.getUsers);
router.get('/user/:id', authMiddleware, userController.getUser);
router.put('/user/:id', authMiddleware, userController.updateUser);
router.delete('/user/:id', authMiddleware, userController.deleteUser);

module.exports = router;
