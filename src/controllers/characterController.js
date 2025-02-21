const characterService = require('../services/characterService');

const createCharacter = async (req, res) => {
    const userId = req.userId;

    try {
        let char = await characterService.createCharacter(req.body, userId);

        res.status(201).json(char);
    } catch(err){
        res.status(500).json({ error: "Internal Server Error" })
    }
}

const findCharacter = async (req, res) => {
    const userId = req.userId;

    try {
        let char = await characterService.findCharacter(req.params.id, userId);

        res.status(200).json(char);
    } catch(err) {
        if (err.message == "Personagem não encontrado"){
            return res.status(404).json({ error: "Personagem não encontrado" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const updateCharacter = async (req, res) => {
    const userId = req.userId;
    const charId = req.params.id;
    const charData = req.body

    try {
        let char = await characterService.updateCharacter(charId, userId, charData);

        res.status(200).json(char);
    } catch(err) {
        if (err.message == "Personagem não encontrado"){
            return res.status(404).json({ error: "Personagem não encontrado" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

const deleteCharacter = async (req, res) => {
    const userId = req.userId;
    const charId = req.params.id;

    try {
        let char = await characterService.deleteCharacter(charId, userId);

        res.status(200).json({ message: "Personagem excluído com sucesso" });
    } catch(err) {
        if (err.message == "Personagem não encontrado"){
            return res.status(404).json({ error: "Personagem não encontrado" });
        } else {
            return res.status(500).json({ error: "Internal Server Error" });
        }
    }
}

module.exports = {
    createCharacter,
    findCharacter,
    updateCharacter,
    deleteCharacter
}