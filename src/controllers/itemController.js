const itemService = require('../services/itemService');
const Character = require('../models/character');
const MissingKeyError = require("../errors/missingKeyError");
const updateCharacterDerivedFields = require('../utils/updateCharacterDerivedFields');

class ItemController {
    async createItem(req, res) {
        try {
            const item = await itemService.createItem(req.body, req.params.characterId);

            await Character.updateOne(
                { _id: req.params.characterId },
                { $addToSet: { items: item._id } }
            );

            await updateCharacterDerivedFields(req.params.characterId, req.userId);

            res.status(201).json(item);
        } catch (err) {
            if (err.message === "Personagem não encontrado."){
                res.status(404).json({ error: err.message});
            }else if (err.message === "type é um campo obrigatório" || err.message.includes("item desconhecido")) {
                res.status(400).json({ error: err.message });
            }else {
                res.status(500).json({ error: "Internal Server Error" })
            } 
        }
    }


    async createManyItems(req, res) {
        try {
            console.log(req.body);
            const items = [];
            for (const data of req.body) {
                const item = await itemService.createItem(data, req.params.characterId);
                items.push(item);
            }
            const itemIds = items.map(i => i._id);

            await Character.updateOne(
                { _id: req.params.characterId },
                { $addToSet: { items: { $each: itemIds } } }
            );

            await updateCharacterDerivedFields(req.params.characterId, req.userId);
            
            res.status(201).json(items);
        } catch (err) {
            if (err.message === "Personagem não encontrado"){
                res.status(404).json({ error: err.message});
            }else if (err.message === "type é um campo obrigatório" || err.message.includes("item desconhecido")) {
                res.status(400).json({ error: err.message });
            }else {
                res.status(500).json({ error: "Internal Server Error" })
            } 
        }
    }

    async updateItem(req, res) {
        try {
            const updated = await itemService.updateItem(req.params.itemId, req.params.characterId, req.body);

            res.status(200).json(updated);
        } catch (err) {
            if (err.message === "Item não encontrado"){
                res.status(404).json({ error: err.message});
            }else {
                res.status(500).json({ error: "Internal Server Error" })
            }
        }
    }

    async deleteItem(req, res) {
        try {
            const deleted = await itemService.deleteItem(req.params.itemId, req.params.characterId);

            await Character.updateOne(
                { _id: req.params.characterId },
                { $pull: { items: req.params.itemId } }
            );

            await updateCharacterDerivedFields(req.params.characterId, req.userId);

            res.status(200).json({ message: "Item excluído com sucesso" });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }

    async getAllItems(req, res) {
        try {
            const items = await itemService.getAllItems(req.params.characterId);

            await updateCharacterDerivedFields(req.params.characterId, req.userId);

            res.status(200).json(items)
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
}

module.exports = new ItemController();
