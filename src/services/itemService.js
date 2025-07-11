const MissingKeyError = require("../errors/missingKeyError");

const Item = require("../models/item");
const Character = require("../models/character");

const Background = require("./../models/itemTypes/background");
const Class = require("./../models/itemTypes/class");
const Consumable = require("./../models/itemTypes/consumable");
const Equipment = require("./../models/itemTypes/equipment");
const Feat = require("./../models/itemTypes/feat");
const Loot = require("./../models/itemTypes/loot");
const Race = require("./../models/itemTypes/race");
const Spell = require("./../models/itemTypes/spell");
const Subclass = require("./../models/itemTypes/subclass");
const Tool = require("./../models/itemTypes/tool");
const Weapon = require("./../models/itemTypes/weapon");

const modelsByType = {
    background: Background,
    class: Class,
    consumable: Consumable,
    equipment: Equipment,
    feat: Feat,
    loot: Loot,
    race: Race,
    spell: Spell,
    subclass: Subclass,
    tool: Tool,
    weapon: Weapon,
};

class ItemService {
    async createItem(itemData, characterId) {
        try {
            itemData.character = characterId;
            itemData.foundryId = itemData._id;
            delete itemData._id;

            if (!itemData.type) {
                throw new Error('type é um campo obrigatório');
            }

            //skips container items
            if (itemData.type == 'container') {
                return;
            }

            const Model = modelsByType[itemData.type];
            if (!Model) {
                throw new Error(`Tipo de item desconhecido: ${itemData.type}`);
            }

            const exists = await Character.exists({ _id: characterId });
            if (!exists) {
                throw new Error("Personagem não encontrado.");
            }

            const item = new Model(itemData);
            await item.save();

            console.log(
                `ItemService::createItem - Item ${item._id} - ${item.name} created successfully`
            );
            return item;
        } catch (err) {
            console.error("ItemService::createItem - ", err);
            throw err;
        }
    }

    async findItem(itemId, characterId) {
        const item = await Item.findOne({
            _id: itemId,
            character: characterId,
        });
        if (!item) {
            console.error(
                `ItemService::findItem - Item with id ${itemId} not found for character ${characterId}`
            );
            throw new Error("Item não encontrado");
        }

        console.log(
            `ItemService::findItem - Item with id ${itemId} found successfully`
        );
        return item;
    }

    async getAllItems(characterId) {
        const exists = await Character.exists({ _id: characterId });
        if (!exists) {
            throw new Error("Personagem não encontrado.");
        }

        const items = await Item.find({ character: characterId });
        console.log(
            `ItemService::getAllItems - ${items.length} items found for character ${characterId}`
        );
        return items;
    }

    async updateItem(itemId, characterId, itemData) {
        try {
            const item = await Item.findOne({
                _id: itemId,
                character: characterId,
            });
            if (!item) {
                throw new Error("Item não encontrado");
            }

            Object.assign(item, itemData);
            const updated = await item.save();

            console.log(
                `ItemService::updateItem - Item ${itemId} updated successfully`
            );
            return updated;
        } catch (err) {
            console.error("ItemService::updateItem - ", err);
            throw err;
        }
    }

    async deleteItem(itemId, characterId) {
        try {
            const deleted = await Item.findOneAndDelete({
                _id: itemId,
                character: characterId,
            });
            if (!deleted) {
                throw new Error("Item não encontrado");
            }

            console.log(
                `ItemService::deleteItem - Item ${itemId} deleted successfully`
            );
            return deleted;
        } catch (err) {
            console.error("ItemService::deleteItem - ", err);
            throw err;
        }
    }
}

module.exports = new ItemService();
