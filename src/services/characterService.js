const Character = require('../models/character');
const User = require('../models/user');
const itemService = require('./itemService');
const MissingKeyError = require('../errors/missingKeyError');

class CharacterService {

    async createCharacter(characterData, userId){
        characterData.user = userId;

        const itemsData = characterData.items || [];
        delete characterData.items;

        if (characterData.system.attributes.init){
            characterData.system.attributes.ini = characterData.system.attributes.init;
            delete characterData.system.attributes.init;
        }
        

        let char = null;

        try {
            let user = await User.findOne({ _id: userId });
            if (!user){
                throw new Error('Usuário não encontrado');
            }

            char = new Character(characterData);
            await char.save();

            //create items
            const createdItems = [];
            for (const itemData of itemsData) {
                const item = await itemService.createItem(itemData, char._id);
                if (item) {
                    createdItems.push(item);
                }
            }

            char.items = createdItems.map(i => i._id);
            await char.save();
            await char.populate('items');
        } catch (err) {
            if (err instanceof MissingKeyError){
                console.error(`CharacterService::createCharacter - ${err.name}: ${err.message}`);
            } else {
                console.error("CharacterService::createCharacter - ", err);
            }
            
            throw(err);
        }

        console.log(`CharacterService::createCharacter - Character ${char._id} - ${char.name} created successfully`);
        return char;
    }

    async findCharacter(charId, userId){
        let char = await Character.findOne({ _id: charId, user: userId });

        if (char){
            console.log(`CharacterService::findCharacter - Character with id ${charId} found successfully`);
            await char.populate('items');
            return char
        }

        console.error(`CharacterService::findCharacter - Character with id ${charId} not found`);
        throw new Error("Personagem não encontrado");        
    }

    async getAllCharacters(userId){
        let chars = await Character.find({user: userId}).select("-system -items");

        console.log(`CharacterService::getAllCharacters - ${chars.length} characters of user ${userId} were found`);
        return chars;
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
            await char.populate('items');
            return char;
        } catch(err){
            if(err instanceof MissingKeyError){
                console.error(`CharacterService::updateCharacter - ${err.name}: ${err.message}`);
            } else{
                console.error("CharacterService::updateCharacter - ", err);
            }
        
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
