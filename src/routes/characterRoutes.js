const express = require('express');
const characterController = require('../controllers/characterController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Ability:
 *       type: object
 *       properties:
 *         value:
 *           type: integer
 *           description: "The ability score value (default: 10)"
 *           example: 10
 *         proficient:
 *           type: integer
 *           description: "Defines if character is proficient or not in an ability (default: 0)"
 *           example: 1
 *         max:
 *           type: integer
 *           description: "The maximum value for this ability (default: null)"
 *           example: 20
 *         bonuses:
 *           type: object
 *           properties:
 *             check:
 *               type: string
 *               description: 'Bonus for ability checks (default: "")'
 *               example: "+2"
 *             save:
 *               type: string
 *               description: 'Bonus for ability saving throws (default: "")'
 *               example: "+3"
 * 
 *     Skill:
 *       type: object
 *       properties:
 *         value:
 *           type: integer
 *           description: 'The skill value (default: 0)'
 *           example: 3
 *         ability:
 *           type: string
 *           description: 'The associated ability for the skill (required)'
 *           example: "dex"
 *         bonuses:
 *           type: object
 *           properties:
 *             check:
 *               type: string
 *               description: 'Bonus for skill checks (default: "")'
 *               example: "+1"
 *             passive:
 *               type: string
 *               description: 'Passive bonus for skill (default: "")'
 *               example: "+2"
 *
 *     Bonus:
 *       type: object
 *       properties:
 *         mwak:
 *           type: object
 *           properties:
 *             attack:
 *               type: string
 *               description: 'Bonus for melee weapon attack (default: "")'
 *               example: "+3"
 *             damage:
 *               type: string
 *               description: 'Bonus for melee weapon damage (default: "")'
 *               example: "1d6+2"
 *         rwak:
 *           type: object
 *           properties:
 *             attack:
 *               type: string
 *               description: 'Bonus for ranged weapon attack (default: "")'
 *               example: "+4"
 *             damage:
 *               type: string
 *               description: 'Bonus for ranged weapon damage (default: "")'
 *               example: "1d8+1"
 *         msak:
 *           type: object
 *           properties:
 *             attack:
 *               type: string
 *               description: 'Bonus for magic melee attack (default: "")'
 *               example: "+5"
 *             damage:
 *               type: string
 *               description: 'Bonus for magic melee damage (default: "")'
 *               example: "1d6+3"
 *         rsak:
 *           type: object
 *           properties:
 *             attack:
 *               type: string
 *               description: 'Bonus for magic ranged attack (default: "")'
 *               example: "+4"
 *             damage:
 *               type: string
 *               description: 'Bonus for magic ranged damage (default: "")'
 *               example: "1d6+2"
 *         abilities:
 *           type: object
 *           properties:
 *             check:
 *               type: string
 *               description: 'Bonus for ability checks (default: "")'
 *               example: "+2"
 *             save:
 *               type: string
 *               description: 'Bonus for ability saving throws (default: "")'
 *               example: "+3"
 *             skill:
 *               type: string
 *               description: 'Bonus for skill checks (default: "")'
 *               example: "+1"
 *         spell:
 *           type: object
 *           properties:
 *             dc:
 *               type: string
 *               description: 'Spellcasting DC bonus (default: "")'
 *               example: "+1"
 * 
 *     Attribute:
 *       type: object
 *       properties:
 *         hp:
 *           type: object
 *           properties:
 *             value:
 *               type: integer
 *               description: Current HP
 *               example: 10
 *             max:
 *               type: integer
 *               description: Maximum HP
 *               example: 10
 *             temp:
 *               type: integer
 *               description: Temporary HP
 *               example: 2
 *             tempmax:
 *               type: integer
 *               description: Temporary max HP
 *               example: 2
 *         ini:
 *           type: object
 *           properties:
 *             ability:
 *               type: string
 *               description: The ability modifier used for initiative
 *               example: "dex"
 *             bonus:
 *               type: string
 *               description: 'Initiative bonus (default: "")'
 *               example: "+2"
 *         movement:
 *           type: object
 *           properties:
 *             burrow:
 *               type: integer
 *               description: 'Burrow speed (default: null)'
 *               example: 0
 *             climb:
 *               type: integer
 *               description: 'Climb speed (default: null)'
 *               example: 0
 *             fly:
 *               type: integer
 *               description: 'Fly speed (default: null)'
 *               example: 30
 *             swim:
 *               type: integer
 *               description: 'Swim speed (default: null)'
 *               example: 0
 *             walk:
 *               type: integer
 *               description: 'Walk speed (default: null)'
 *               example: 30
 *             units:
 *               type: string
 *               description: 'Units for movement (default: "ft")'
 *               example: "ft"
 *         attunement:
 *           type: object
 *           properties:
 *             max:
 *               type: integer
 *               description: 'Maximum number of attuned items (default: 3)'
 *               example: 3
 *         senses:
 *           type: object
 *           properties:
 *             darkvision:
 *               type: integer
 *               description: 'Darkvision range (default: null)'
 *               example: 60
 *             blindsight:
 *               type: integer
 *               description: 'Blindsight range (default: null)'
 *               example: 0
 *             tremorsense:
 *               type: integer
 *               description: 'Tremorsense range (default: null)'
 *               example: 0
 *             truesight:
 *               type: integer
 *               description: 'Truesight range (default: null)'
 *               example: 0
 *             units:
 *               type: string
 *               description: 'Units for senses range (default: "ft")'
 *               example: "ft"
 *         ac:
 *           type: object
 *           properties:
 *             flat:
 *               type: integer
 *               description: Flat Armor Class
 *               example: 15
 *             calc:
 *               type: string
 *               description: Armor Class calculation method
 *               example: "default"
 *         concentration:
 *           type: object
 *           properties:
 *             ability:
 *               type: string
 *               description: Ability for concentration checks
 *               example: "con"
 *             limit:
 *               type: integer
 *               description: Maximum concentration limit
 *               example: 1
 *         inspiration:
 *           type: boolean
 *           description: Whether the character has inspiration
 *           example: true
 *         spellcasting:
 *           type: string
 *           description: Spellcasting ability
 *           example: "int"
 *         exhaustion:
 *           type: integer
 *           description: Level of exhaustion
 *           example: 0
 *
 *     Details:
 *       type: object
 *       properties:
 *         biography:
 *           type: object
 *           properties:
 *             value:
 *               type: string
 *               description: Character's biography
 *               example: "A skilled adventurer from a small town."
 *             public:
 *               type: string
 *               description: Publicly viewable biography
 *               example: "Adventurer with a mysterious past."
 *         alignment:
 *           type: string
 *           description: Character's alignment
 *           example: "Lawful Good"
 *         appearance:
 *           type: string
 *           description: Character's appearance description
 *           example: "Tall, with long black hair and green eyes."
 *         trait:
 *           type: string
 *           description: Character's personality trait
 *           example: "Cautious"
 *         ideal:
 *           type: string
 *           description: Character's ideal
 *           example: "Justice"
 *         bond:
 *           type: string
 *           description: Character's bond
 *           example: "I will protect my family."
 *         flaw:
 *           type: string
 *           description: Character's flaw
 *           example: "Overconfident in battle."
 *         race:
 *           type: string
 *           description: Character's race
 *           example: "Elf"
 *         background:
 *           type: string
 *           description: Character's background
 *           example: "Soldier"
 *         originalClass:
 *           type: string
 *           description: Original character class
 *           example: "Warrior"
 *         level:
 *           type: integer
 *           description: Character's level
 *           example: 5
 *         xp:
 *           type: object
 *           properties:
 *             value:
 *               type: integer
 *               description: Character's XP
 *               example: 1500
 *
 *     Traits:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *           description: Character's size
 *           example: "Medium"
 *         di:
 *           type: object
 *           properties:
 *             bypasses:
 *               type: array
 *               items:
 *                 type: string
 *               description: Damage immunities bypasses
 *               example: ["magic"]
 *             value:
 *               type: array
 *               items:
 *                 type: string
 *               description: Damage immunities
 *               example: ["fire"]
 *             custom:
 *               type: string
 *               description: Custom damage immunity
 *               example: "None"
 *         dr:
 *           type: object
 *           properties:
 *             bypasses:
 *               type: array
 *               items:
 *                 type: string
 *               description: Damage reduction bypasses
 *               example: ["magic"]
 *             value:
 *               type: array
 *               items:
 *                 type: string
 *               description: Damage reduction values
 *               example: ["fire"]
 *         resist:
 *           type: object
 *           properties:
 *             bypasses:
 *               type: array
 *               items:
 *                 type: string
 *               description: Resistance bypasses
 *               example: ["magic"]
 *             value:
 *               type: array
 *               items:
 *                 type: string
 *               description: Resistances
 *               example: ["fire"]
 *     Character:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           description: Unique identifier for the character (MongoDB ObjectId)
 *           example: "60b6f6f8c6f1e3f8b8c6f6f9"
 *         name:
 *           type: string
 *           description: Character's name (required)
 *           example: "Bruenor"
 *         type:
 *           type: string
 *           description: "The type of character, default is 'character'"
 *           example: "character"
 *         img:
 *           type: string
 *           description: URL of the character's image
 *           example: "https://example.com/character.jpg"
 *         user:
 *           type: string
 *           description: User ID associated with the character (MongoDB ObjectId)
 *           example: "60b6f6f8c6f1e3f8b8c6f6f9"
 *         items:
 *           type: array
 *           description: Items owned by the character
 *           items:
 *             type: object
 *           example: []
 *         system:
 *           type: object
 *           description: System-related character attributes
 *           properties:
 *             abilities:
 *               type: object
 *               description: Character's ability scores
 *               properties:
 *                 str:
 *                   $ref: '#/components/schemas/Ability'
 *                 dex:
 *                   $ref: '#/components/schemas/Ability'
 *                 con:
 *                   $ref: '#/components/schemas/Ability'
 *                 int:
 *                   $ref: '#/components/schemas/Ability'
 *                 wis:
 *                   $ref: '#/components/schemas/Ability'
 *                 cha:
 *                   $ref: '#/components/schemas/Ability'
 *             skills:
 *               type: object
 *               description: Character's skill proficiencies
 *               properties:
 *                 acr: { $ref: '#/components/schemas/Skill' }
 *                 ani: { $ref: '#/components/schemas/Skill' }
 *                 arc: { $ref: '#/components/schemas/Skill' }
 *                 ath: { $ref: '#/components/schemas/Skill' }
 *                 dec: { $ref: '#/components/schemas/Skill' }
 *                 his: { $ref: '#/components/schemas/Skill' }
 *                 ins: { $ref: '#/components/schemas/Skill' }
 *                 itm: { $ref: '#/components/schemas/Skill' }
 *                 inv: { $ref: '#/components/schemas/Skill' }
 *                 med: { $ref: '#/components/schemas/Skill' }
 *                 nat: { $ref: '#/components/schemas/Skill' }
 *                 prc: { $ref: '#/components/schemas/Skill' }
 *                 prf: { $ref: '#/components/schemas/Skill' }
 *                 per: { $ref: '#/components/schemas/Skill' }
 *                 rel: { $ref: '#/components/schemas/Skill' }
 *                 slt: { $ref: '#/components/schemas/Skill' }
 *                 ste: { $ref: '#/components/schemas/Skill' }
 *                 sur: { $ref: '#/components/schemas/Skill' }
 *             attributes:
 *               $ref: '#/components/schemas/Attribute'
 *             details:
 *               $ref: '#/components/schemas/Details'
 *             traits:
 *               $ref: '#/components/schemas/Traits'
 *             bonuses:
 *               $ref: '#/components/schemas/Bonus'
 *             currency:
 *               type: object
 *               description: Character's currency balance
 *               properties:
 *                 pp:
 *                   type: number
 *                   description: Platinum pieces
 *                   example: 5
 *                 gp:
 *                   type: number
 *                   description: Gold pieces
 *                   example: 150
 *                 ep:
 *                   type: number
 *                   description: Electrum pieces
 *                   example: 0
 *                 sp:
 *                   type: number
 *                   description: Silver pieces
 *                   example: 25
 *                 cp:
 *                   type: number
 *                   description: Copper pieces
 *                   example: 100
 */

/**
 * @swagger
 * /api/v1/character:
 *      post:
 *          description: Creates a new character. Only "name" field is required. All other fields are optional and will be filled with default values if not provided. 
 *          summary: Creates a new character
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Character
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  required: true
 *                                  description: Character's name
 *                                  example: Bruenor
 *          responses:
 *              201:
 *                  description: Character created
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Character'
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
 *                                      example: name
 *                                  message:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: name é um campo obrigatório
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
router.post('/character', authMiddleware, characterController.createCharacter);

/**
 * @swagger
 * /api/v1/character/{id}:
 *      get:
 *          description: Returns a character if it exists
 *          summary: Returns a character
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Character
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: string
 *                    description: Character id
 *              
 *          responses:
 *              200:
 *                  description: Character found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Character'
 *              404:
 *                  description: Character not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Personagem não encontrado
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
router.get('/character/:id', authMiddleware, characterController.findCharacter);

/**
 * @swagger
 * /api/v1/characters:
 *      get:
 *          description: Returns all characters of a user. Returns an empty list if there's no character.
 *          summary: Returns all characters of the user
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Character
 *              
 *          responses:
 *              200:
 *                  description: Character found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Character'
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
router.get('/characters', authMiddleware, characterController.getAllCharacters);

/**
 * @swagger
 * /api/v1/character/{id}:
 *      put:
 *          description: Updates an existing character. You may provide only the updated fields in body. Non provided fields remain unchanged.
 *          summary: Updates a character
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Character
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: string
 *                    description: Character id
 *          requestBody:
 *              required: true
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              name:
 *                                  type: string
 *                                  description: Character's name
 *                                  example: Bruenor
 *                              img:
 *                                  type: string
 *                                  description: Character's img url or path
 *                                  example: https://static.wikia.nocookie.net/forgottenrealms/images/c/c2/Bruenor_Battlehammer_AFR.jpg/revision/latest?cb=20210701120700
 *                              system:
 *                                  type: object
 *                                  description: Core system data of the character
 *                                  properties:
 *                                      details:
 *                                          $ref: '#/components/schemas/Details'
 *          responses:
 *              200:
 *                  description: Character updated
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              $ref: '#/components/schemas/Character'
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
 *                                      example: name
 *                                  message:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: name é um campo obrigatório
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
 *              404:
 *                  description: Character not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Personagem não encontrado
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
router.put('/character/:id', authMiddleware, characterController.updateCharacter);

/**
 * @swagger
 * /api/v1/character/{id}:
 *      delete:
 *          description: Deletes an existing character.  
 *          summary: Deletes a character
 *          security:
 *              - bearerAuth: []
 *          tags:
 *              - Character
 *          parameters:
 *              - in: path
 *                name: id
 *                required: true
 *                schema:
 *                    type: string
 *                    description: Character id
 *              
 *          responses:
 *              200:
 *                  description: Character deleted
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              schema:
 *                                  message:
 *                                      type: string
 *                                      description: return message
 *                                      example: Personagem excluído com sucesso
 *              404:
 *                  description: Character not found
 *                  content:
 *                      application/json:
 *                          schema:
 *                              type: object
 *                              properties:
 *                                  error:
 *                                      type: string
 *                                      description: Error message.
 *                                      example: Personagem não encontrado
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
router.delete('/character/:id', authMiddleware, characterController.deleteCharacter);

module.exports = router;