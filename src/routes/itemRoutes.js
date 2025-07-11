const express = require('express');
const itemController = require('../controllers/itemController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Items
 *   description: Character Item Management Routes
 */

/**
 * @swagger
 * /characters/{characterId}/item:
 *   post:
 *     summary: Creates an item for a Character
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         required: true
 *         schema:
 *           type: string
 *         description: character ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "Disguise Kit"
 *               type: "tool"
 *               system: {}
 *     responses:
 *       201:
 *         description: Item created successfully
 *       400:
 *         description: Validation error - Type not provided
 *       404:
 *         description: Character not found
 *       500:
 *         description: Internal Server Error
 */
router.post('/item', authMiddleware, itemController.createItem);

/**
 * @swagger
 * /characters/{characterId}/items:
 *   post:
 *     summary: Creates many itens for a character
 *     security:
 *       - bearerAuth: [] 
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         required: true
 *         schema:
 *           type: string
 *         description: Character ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               example:
 *                 name: "Item Name"
 *                 type: "tool"
 *                 system: {}
 *     responses:
 *       201:
 *         description: Itens created successfully
 *       404:
 *         description: Character not Found
 *       500:
 *         description: Internal Server Error
 */
router.post('/items', authMiddleware, itemController.createManyItems);

/**
 * @swagger
 * /characters/{characterId}/item/{itemId}:
 *   put:
 *     summary: Updates a character's items
 *     security:
 *       - bearerAuth: []
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             example:
 *               name: "New Name"
 *               system: {}
 *     responses:
 *       200:
 *         description: Item updated successfully
 *       404:
 *         description: Character ou item nnot found
 *       500:
 *         description: Internal Server Error
 */
router.put('/item/:itemId', authMiddleware, itemController.updateItem);

/**
 * @swagger
 * /characters/{characterId}/item/{itemId}:
 *   delete:
 *     summary: Removes a character item
 *     security:
 *       - bearerAuth: []
 *     tags: [Items]
 *     parameters:
 *       - in: path
 *         name: characterId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed successfully
 *       404:
 *         description: character or item not found
 *       500:
 *         description: Internal Server Error
 */
router.delete('/item/:itemId', authMiddleware, itemController.deleteItem);

module.exports = router;