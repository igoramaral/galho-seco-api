const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

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
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh Token
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

/**
 * @swagger
 * /api/v1/refresh-token:
 *   post:
 *     description: Returns a new JWT Access Token and a new Refresh Token
 *     tags:
 *       - Auth
 *     summary: Refreshes JWT Token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 required: true
 *                 example: 9445109c0e70b5e533a03160719bdb9ac7e4195e25a31767539a8980ae44b185a7e84c498fbf3ce0
 *     responses:
 *       200:
 *         description: Request successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh Token
 *       400:
 *         description: Required fields refreshToken was provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Refresh Token é obrigatório
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Refresh Token expirado ou inválido
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
router.post('/refresh-token', authController.refreshAccessToken);

/**
 * @swagger
 * /api/v1/logout:
 *   post:
 *     description: Removes Refresh Token from User
 *     tags:
 *       - Auth
 *     summary: Logouts User
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The outcome of the action
 *                   example: Logout realizado com sucesso
 *       404:
 *         description: user not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
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
router.post('/logout', authMiddleware, authController.logout);

/**
 * @swagger
 * /api/v1/change-password:
 *   post:
 *     description: Updates password of a User and generates a new token and refresh token
 *     tags:
 *       - Auth
 *     summary: Changes User Password
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 required: true
 *                 description: user's current password
 *               newPassword:
 *                 type: string
 *                 required: true
 *                 description: user's new password
 *     responses:
 *       200:
 *         description: update successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT authentication
 *                 refreshToken:
 *                   type: string
 *                   description: Refresh Token
 *       400:
 *         description: Required fields password and/or newPassword were not provided
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message.
 *                   example: Informe sua senha
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   description: Error message. Indicates if user was not found, if password is invalid or if access token is invalid.
 *                   example: Token inválido ou expirado
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
router.post('/change-password', authMiddleware, authController.changePassword);

module.exports = router;