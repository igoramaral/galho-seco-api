const itemService = require('../../services/itemService');
const Character = require('../../models/character');
const updateCharacterDerivedFields = require('../../utils/updateCharacterDerivedFields');
const ItemController = require('../../controllers/itemController');

// Mocks
jest.mock('../../services/itemService');
jest.mock('../../models/character', () => ({
  updateOne: jest.fn()
}));
jest.mock('../../utils/updateCharacterDerivedFields', () => jest.fn());

describe('ItemController', () => {
  let req, res;

  beforeEach(() => {
    req = {
      params: { characterId: 'char123', itemId: 'item123' },
      body: { name: 'Sword', type: 'weapon' },
      userId: 'user123'
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    jest.clearAllMocks();
  });

  describe('createItem', () => {
    it('should create an item and update character', async () => {
      const fakeItem = { _id: 'item123', name: 'Sword' };
      itemService.createItem.mockResolvedValue(fakeItem);

      await ItemController.createItem(req, res);

      expect(itemService.createItem).toHaveBeenCalledWith(req.body, req.params.characterId);
      expect(Character.updateOne).toHaveBeenCalledWith(
        { _id: req.params.characterId },
        { $addToSet: { items: fakeItem._id } }
      );
      expect(updateCharacterDerivedFields).toHaveBeenCalledWith(req.params.characterId, req.userId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(fakeItem);
    });

    it('should return 404 if character not found', async () => {
      itemService.createItem.mockRejectedValue(new Error('Personagem não encontrado.'));

      await ItemController.createItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Personagem não encontrado.' });
    });
  });

  describe('createManyItems', () => {
    it('should create many items and update character', async () => {
      req.body = [
        { name: 'Sword', type: 'weapon' },
        { name: 'Shield', type: 'equipment' }
      ];
      const items = [
        { _id: 'item1', name: 'Sword' },
        { _id: 'item2', name: 'Shield' }
      ];
      itemService.createItem
        .mockResolvedValueOnce(items[0])
        .mockResolvedValueOnce(items[1]);

      await ItemController.createManyItems(req, res);

      expect(itemService.createItem).toHaveBeenCalledTimes(2);
      expect(Character.updateOne).toHaveBeenCalledWith(
        { _id: req.params.characterId },
        { $addToSet: { items: { $each: ['item1', 'item2'] } } }
      );
      expect(updateCharacterDerivedFields).toHaveBeenCalledWith(req.params.characterId, req.userId);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(items);
    });
  });

  describe('updateItem', () => {
    it('should update an item', async () => {
      const updatedItem = { _id: 'item123', name: 'Axe' };
      itemService.updateItem.mockResolvedValue(updatedItem);

      await ItemController.updateItem(req, res);

      expect(itemService.updateItem).toHaveBeenCalledWith(
        req.params.itemId,
        req.params.characterId,
        req.body
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(updatedItem);
    });

    it('should return 404 if item not found', async () => {
      itemService.updateItem.mockRejectedValue(new Error('Item não encontrado'));

      await ItemController.updateItem(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: 'Item não encontrado' });
    });
  });

  describe('deleteItem', () => {
    it('should delete an item and update character', async () => {
      itemService.deleteItem.mockResolvedValue(true);

      await ItemController.deleteItem(req, res);

      expect(itemService.deleteItem).toHaveBeenCalledWith(req.params.itemId, req.params.characterId);
      expect(Character.updateOne).toHaveBeenCalledWith(
        { _id: req.params.characterId },
        { $pull: { items: req.params.itemId } }
      );
      expect(updateCharacterDerivedFields).toHaveBeenCalledWith(req.params.characterId, req.userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Item excluído com sucesso' });
    });
  });

  describe('getAllItems', () => {
    it('should return all items', async () => {
      const items = [{ _id: 'item1' }, { _id: 'item2' }];
      itemService.getAllItems.mockResolvedValue(items);

      await ItemController.getAllItems(req, res);

      expect(itemService.getAllItems).toHaveBeenCalledWith(req.params.characterId);
      expect(updateCharacterDerivedFields).toHaveBeenCalledWith(req.params.characterId, req.userId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(items);
    });
  });
});
