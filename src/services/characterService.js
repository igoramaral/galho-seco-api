const Character = require('../models/character');

class CharacterService {

    async createCharacter(characterData, userId){
        characterData.user = userId;
        let char = new Character(characterData);

        try {
            await char.save().then((result) => {
                char = result
            })
        } catch (err) {
            console.error("CharacterService::createCharacter - ", err);
            throw(err);
        }

        console.log(`CharacterService::createCharacter - Character ${char._id} - ${char.name} created successfully`);
        return char;
    }

    async findCharacter(charId, userId){
        let char = await Character.findOne({ _id: charId, user: userId });

        if (char){
            console.log(`CharacterService::findCharacter - Character with id ${charId} found successfully`);
            return char
        }

        console.error(`CharacterService::findCharacter - Character with id ${charId} not found`);
        throw new Error("Personagem não encontrado");        
    }

    async updateCharacter(charId, userId, characterData){
        try {
            let char = await Character.findOne({ _id: charId, user: userId });

            if (!char) {
                throw new Error("Personagem não encontrado");
            }
            
            Object.assign(char, characterData);
            char = await char.save();

            console.log(`CharacterService::updateCharacter - Character ${charId} updated successfully`);
            return char;
        } catch(err){
            console.error("CharacterService::updateCharacter - ", err);
            throw err;
        }
    }

    async deleteCharacter(charId, userId){
        try {
            const deletedChar = await Character.findOneAndDelete({ _id: charId, user: userId });
        
            if (!deletedChar) {
                throw new Error("Personagem não encontrado");
            }
        
            console.log(`CharacterService::deleteCharacter - Character ${charId} deleted successfully`);
            return deletedChar;
        } catch (error) {
        console.error("CharacterService::deleteCharacter - ", error);
        throw error;
        }
    }
}

module.exports = new CharacterService();
