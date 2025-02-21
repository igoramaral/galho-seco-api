const express = require('express');
const characterController = require('../controllers/characterController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/character', authMiddleware, characterController.createCharacter);
router.get('/character/:id', authMiddleware, characterController.findCharacter);
router.put('/character/:id', authMiddleware, characterController.updateCharacter);
router.delete('/character/:id', authMiddleware, characterController.deleteCharacter);

module.exports = router;