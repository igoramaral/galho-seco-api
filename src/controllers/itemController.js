const itemService = require('../services/itemService');
const Character = require('../models/character');

class ItemController {
    async createItem(req, res) {
        try {
            const item = await itemService.createItem(req.body, req.params.characterId);

            await Character.updateOne(
                { _id: req.params.characterId },
                { $addToSet: { items: item._id } }
            );

            res.status(201).json(item);
        } catch (err) {
            if (err instanceof MissingKeyError) {
                res.status(err.statusCode).json({ 
                    error: err.name,
                    field: err.field,
                    message: err.message
                });
            } else {
                if (err.message === "Personagem não encontrado"){
                    res.status(404).json({ error: err.message});
                }else {
                    res.status(500).json({ error: "Internal Server Error" })
                } 
            }
        }
    }

    async createManyItems(req, res) {
        try {
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
            
            res.status(201).json(items);
        } catch (err) {
            if (err.message === "Personagem não encontrado"){
                res.status(404).json({ error: err.message});
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
            if (err.message === "Personagem não encontrado"){
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

            res.status(200).json({ message: "Item excluído com sucesso" });
        } catch (err) {
            res.status(404).json({ error: err.message });
        }
    }
}

module.exports = new ItemController();
