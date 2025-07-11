const Character = require('../models/character');

async function updateCharacterDerivedFields(characterId, userId) {
    const character = await Character.findOne({ _id: characterId, user: userId }).populate('items');

    if (!character) {
        throw new Error('Character not found');
    }

    const classItems = character.items.filter(item => item.type === 'class');

    let level = 0;
    for (const item of classItems) {
        level += item.system.levels;
    }
    console.log(level);
    level = level > 0 ? level : 1;

    // update race
    const raceItem = character.items.find(item => item.type === 'race');
    const race = raceItem ? raceItem.name : '';

    // update classes
    const classInfo = classItems.map(item => item.name).join(', ');

    const updateInfo = {
        level: level,
        race: race,
        classes: classInfo
    }

    console.log(updateInfo);

    Object.assign(character, updateInfo);
    let char = await character.save();

    return char;
}

module.exports = updateCharacterDerivedFields;
