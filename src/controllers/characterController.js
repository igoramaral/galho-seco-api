const characterService = require('../services/characterService');
const MissingKeyError = require('../errors/missingKeyError');

const createCharacter = async (req, res) => {
    const userId = req.userId;

    try {
        let char = await characterService.createCharacter(req.body, userId);

        res.status(201).json(char);
    } catch(err){
        if (err instanceof MissingKeyError){
            res.status(err.statusCode).json({ 
                error: err.name,
                field: err.field,
                message: err.message
             });
        } else {
            if (err.message === "Usuário não encontrado"){
                res.status(404).json({ error: err.message});
            }else {
                res.status(500).json({ error: "Internal Server Error" })
            }
            
        }
        
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

const getAllCharacters = async (req, res) => {
    const userId = req.userId;

    try {
        let chars = await characterService.getAllCharacters(userId);

        res.status(200).json(chars);
    } catch(err) {
        return res.status(500).json({ error: "Internal Server Error" });
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
        } else if (err instanceof MissingKeyError){
            res.status(err.statusCode).json({ 
                error: err.name,
                field: err.field,
                message: err.message
             });
        } else {
            res.status(500).json({ error: "Internal Server Error" })
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
    getAllCharacters,
    updateCharacter,
    deleteCharacter
}