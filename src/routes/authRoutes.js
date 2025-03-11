const express = require('express');
const authController = require('../controllers/authController');


const router = express.Router();

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     description: User Login and JWT token creation
 *     tags:
 *       - Auth
 *     summary: Logins an user and returns a JWT token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 required: true
 *                 example: user@email.com
 *               password:
 *                 type: string
 *                 required: true
 *                 example: testpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication
 *                 user:
 *                   type: object
 *                   properties:
 *                     nome:
 *                       type: string
 *                       description: User's full name
 *                       example: João das Neves
 *                     dataNascimento:
 *                       type: string
 *                       format: date-time
 *                       description: User's date of birth
 *                       example: "2012-04-23T00:00:00.000Z"
 *                     email:
 *                       type: string
 *                       description: User's email
 *                       example: user@email.com
 *                     id:
 *                       type: string
 *                       description: User ID
 *                       example: 67b507d8fb08e91a9ad94c2c
 *       400:
 *         description: Required fields "email" and/or "password" were not provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Email e Senha são obrigatórios
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message. Indicates if user does not exist or if password is incorrect.
 *                   example: Usuário não encontrado
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Internal Server Error
 */
router.post('/login', authController.login);

module.exports = router;