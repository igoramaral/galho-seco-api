const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *          type: object
 *          properties:
 *              nome:
 *                  type: string
 *                  description: User's full name
 *                  example: João das Neves
 *              dataNascimento:
 *                  type: string
 *                  format: date-time
 *                  description: User's date of birth
 *                  example: "2012-04-23T00:00:00.000Z"
 *              email:
 *                  type: string
 *                  description: User's email
 *                  example: user@email.com
 *              id:
 *                  type: string
 *                  description: User ID (MongoDB ObjectId)
 *                  example: 67b507d8fb08e91a9ad94c2c
 */

/**
 * @swagger
 * /api/v1/user:
 *      post:
 *          description: Creates a new user. Must provide field nome, dataNascimento, email and password in request body.
 *          summary: Creates a new user
 *          tags:
 *              - User
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nome:
 *                                  type: string
 *                                  required: true
 *                                  description: User's full name
 *                                  example: João das Neves
 *                              dataNascimento:
 *                                  type: string
 *                                  required: true
 *                                  format: date-time
 *                                  description: User's date of birth
 *                                  example: "2012-04-23"
 *                              email:
 *                                  type: string
 *                                  required: true
 *                                  description: User's email
 *                                  example: joaodasneves@email.com
 *                              password:
 *                                  type: string
 *                                  required: true
 *                                  description: User's password
 *                                  example: testpassword
 *          responses:
 *              201:
 *                  description: User created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/User'
 *              400:
 *                  description: Required field not provided
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: The error's instance name.
 *                                      example: MissingKeyError
 *                                  field:
 *                                      type: string
 *                                      description: The field where the error occurred.
 *                                      example: email
 *                                  message:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: email é um campo obrigatório
 *              422:
 *                  description: Email already in use
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: The error's instance name.
 *                                      example: DuplicateKeyError
 *                                  field:
 *                                      type: string
 *                                      description: The field where the error occurred.
 *                                      example: email
 *                                  message:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: email já está em uso
 *              500:
 *                  description: Internal server error
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Internal Server Error
 */
router.post('/user', userController.createUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *      get:
 *          description: Returns an existing user
 *          security:
 *              - bearerAuth: []
 *          summary: Returns an user
 *          tags:
 *              - User                  
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: string
 *                    description: User id
 *          responses:
 *              200:
 *                  description: User updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/User'
 *              401:
 *                  description: Unauthorized
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Token não fornecido
 *              403:
 *                  description: Wrong user (User can only find itself)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Você não tem permissão para obter outro perfil
 *              404:
 *                  description: User not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Usuário não encontrado
 */
router.get('/user/:id', authMiddleware, userController.getUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *      put:
 *          description: Updates an existing user. You may provide only the updated fields in body. Non provided fields remain unchanged.
 *          security:
 *              - bearerAuth: []
 *          summary: Updates an user
 *          tags:
 *              - User
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: string
 *                    description: User id                  
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              nome:
 *                                  type: string
 *                                  required: false
 *                                  description: User's full name
 *                                  example: João das Neves
 *                              dataNascimento:
 *                                  type: string
 *                                  required: false
 *                                  format: date-time
 *                                  description: User's date of birth
 *                                  example: "2012-04-23T00:00:00.000Z"
 *                              email:
 *                                  type: string
 *                                  required: false
 *                                  description: User's email
 *                                  example: joaodasneves@email.com
 *                              password:
 *                                  type: string
 *                                  required: false
 *                                  description: User's password
 *                                  example: testpassword
 *          responses:
 *              200:
 *                  description: User found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/User'
 *              400:
 *                  description: Required field not provided. Happens if setting required field to null or undefined.
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: The error's instance name.
 *                                      example: MissingKeyError
 *                                  field:
 *                                      type: string
 *                                      description: The field where the error occurred.
 *                                      example: email
 *                                  message:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: email é um campo obrigatório
 *              401:
 *                  description: Unauthorized
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Token não fornecido
 *              403:
 *                  description: Wrong user (User can only update itself)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Você não tem permissão para editar outro perfil
 *              422:
 *                  description: Email already in use
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: The error's instance name.
 *                                      example: DuplicateKeyError
 *                                  field:
 *                                      type: string
 *                                      description: The field where the error occurred.
 *                                      example: email
 *                                  message:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: email já está em uso
 *              500:
 *                  description: Internal server error
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Internal Server Error
 */
router.put('/user/:id', authMiddleware, userController.updateUser);

/**
 * @swagger
 * /api/v1/user/{id}:
 *      delete:
 *          description: Deletes an existing user
 *          security:
 *              - bearerAuth: []
 *          summary: Deletes an user
 *          tags:
 *              - User                  
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: string
 *                    description: User id
 *          responses:
 *              200:
 *                  description: User deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  message:
 *                                      type: string
 *                                      description: Return message.
 *                                      example: Usuário excluído com sucesso
 *              401:
 *                  description: Unauthorized
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Token não fornecido
 *              403:
 *                  description: Wrong user (User can only delete itself)
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Você não tem permissão para deletar outro perfil
 *              404:
 *                  description: User not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Usuário não encontrado
 *              500:
 *                  description: Internal server error
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Internal Server Error
 */
router.delete('/user/:id', authMiddleware, userController.deleteUser);

module.exports = router;
