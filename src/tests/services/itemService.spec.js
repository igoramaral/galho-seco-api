const mockingoose = require('mockingoose');
const Item = require('../../models/item');
const Character = require('../../models/character');
const itemService = require('../../services/itemService');

describe('ItemService', () => {
    const characterId = '64e123abc123abc123abc123';

    afterEach(() => {
        mockingoose.resetAll();
    });

    it('should create an item', async () => {
        const itemData = { name: 'Sword', type: 'weapon' };

        // personagem existe
        mockingoose(Character).toReturn({ _id: characterId }, 'findOne');

        // item salvo
        const savedItem = { ...itemData, _id: '1', character: characterId };
        mockingoose(Item).toReturn(savedItem, 'save');

        const result = await itemService.createItem(itemData, characterId);

        expect(result.name).toBe('Sword');
        expect(result.character.toString()).toBe(characterId);
    });

    it('should throw if character does not exist when creating item', async () => {
        const itemData = { name: 'Sword', type: 'weapon' };

        mockingoose(Character).toReturn(null, 'findOne');

        await expect(itemService.createItem(itemData, characterId))
            .rejects
            .toThrow('Personagem não encontrado.');
    });

    it('should find an item', async () => {
        const foundItem = { _id: '1', name: 'Sword', character: characterId };
        mockingoose(Item).toReturn(foundItem, 'findOne');

        const result = await itemService.findItem('1', characterId);

        expect(result.name).toBe('Sword');
        expect(result.character.toString()).toBe(characterId);
    });

    it('should throw if item not found', async () => {
        mockingoose(Item).toReturn(null, 'findOne');

        await expect(itemService.findItem('1', characterId))
            .rejects
            .toThrow('Item não encontrado');
    });

    it('should get all items', async () => {
        mockingoose(Character).toReturn({ _id: characterId }, 'findOne');

        const items = [
            { name: 'Sword', character: characterId },
            { name: 'Shield', character: characterId }
        ];

        mockingoose(Item).toReturn(items, 'find');

        const result = await itemService.getAllItems(characterId);

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Sword');
    });

    it('should throw if character does not exist when getting all items', async () => {
        mockingoose(Character).toReturn(null, 'findOne');

        await expect(itemService.getAllItems(characterId))
            .rejects
            .toThrow('Personagem não encontrado.');
    });

    it('should update an item', async () => {
        const updatedData = { name: 'Magic Sword' };

        const existingItem = {
            _id: '65a1234567890abcde123456',
            name: 'Sword',
            character: characterId,
            type: 'weapon'
        };

        mockingoose(Item).toReturn(existingItem, 'findOne');

        const updatedItem = {
            ...existingItem,
            name: 'Magic Sword'
        };

        mockingoose(Item).toReturn(updatedItem, 'save');

        const result = await itemService.updateItem(existingItem._id, characterId, updatedData);

        expect(result.name).toBe('Magic Sword');
    });

    it('should throw if item not found when updating', async () => {
        mockingoose(Item).toReturn(null, 'findOne');

        await expect(itemService.updateItem('invalidId', characterId, {}))
            .rejects
            .toThrow('Item não encontrado');
    });

    it('should delete an item', async () => {
        const deletedItem = {
            _id: '1',
            name: 'Sword',
            character: characterId
        };

        mockingoose(Item).toReturn(deletedItem, 'findOneAndDelete');

        const result = await itemService.deleteItem('1', characterId);

        expect(result.name).toBe('Sword');
    });

    it('should throw if item not found when deleting', async () => {
        mockingoose(Item).toReturn(null, 'findOneAndDelete');

        await expect(itemService.deleteItem('invalidId', characterId))
            .rejects
            .toThrow('Item não encontrado');
    });
});
