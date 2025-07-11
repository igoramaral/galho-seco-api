const mongoose = require('mongoose');
const MissingKeyError = require('../errors/missingKeyError');
const Item = require('./item');
const User = require('./user');

function transformDocument(doc, ret) {
    ret.id = ret._id;
    ret.type = "character";  
    delete ret._id;  
    delete ret.__v;  
    return ret;
}

const abilitySchema = new mongoose.Schema({
    value: { type: Number, default: 10 },
    proficient: { type: Number, default: 0 },
    max: { type: Number, default: null },
    bonuses: {
        check: { type: String, default: "" },
        save: { type: String, default: "" }
    }
},
{ _id: false })

const skillSchema = new mongoose.Schema({
    value: { type: Number, default: 0 },
    ability: { type: String, required: true },
    bonuses: {
        check: { type: String, default: "" },
        passive: { type: String, default: "" }
    }
},
{ _id: false })

const bonusSchema = new mongoose.Schema({
    mwak: {
        attack: { type: String, default: "" },
        damage: { type: String, default: "" }
    },
    rwak: {
        attack: { type: String, default: "" },
        damage: { type: String, default: "" }
    },
    msak: {
        attack: { type: String, default: "" },
        damage: { type: String, default: "" }
    },
    rsak: {
        attack: { type: String, default: "" },
        damage: { type: String, default: "" }
    },
    abilities: {
        check: { type: String, default: "" },
        save: { type: String, default: "" },
        skill: { type: String, default: "" }
    },
    spell: {
        dc: { type: String, default: "" }
    }
},
{ _id: false })

const spellSlotSchema = new mongoose.Schema({
    spell1: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell2: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell3: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell4: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell5: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell6: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell7: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell8: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    spell9: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    },
    pact: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null },
        available: { type: Number, default: null }
    }
},
{ _id: false })

const attributeSchema = new mongoose.Schema({
    hp: {
        value: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        temp: { type: Number, default: 0 },
        tempmax: { type: Number, default: 0 },
    },
    init: {
        ability: { type: String, default: "" },
        bonus: { type: String, default: "" }
    },
    movement:{
        burrow: { type: Number, default: null },
        climb: { type: Number, default: null },
        fly: { type: Number, default: null },
        swim: { type: Number, default: null },
        walk: { type: Number, default: null },
        units: { type: String, default: "ft" }
    },
    attunement: {
        max: { type: Number, default: 3 },
    },
    senses: {
        darkvision: { type: Number, default: null },
        blindsight: { type: Number, default: null },
        tremorsense: { type: Number, default: null },
        truesight: { type: Number, default: null },
        units: { type: String, default: "ft" }
    },
    death: {
        ability: { type: String, default: "" },
        success: { type: Number, default: 0 },
        failure: { type: Number, default: 0 }
    },
    ac: {
        flat: { type: Number, default: null },
        calc: { type: String, default: "default" }
    },
    concentration: {
        ability: { type: String, default: "" },
        limit: { type: Number, default: 1 }
    },
    inspiration: { type: Boolean, default: false },
    spellcasting: { type: String, default: "" },
    exhaustion: { type: Number, default: 0 }
},
{ _id: false })

const detailsSchema = new mongoose.Schema({
    biography: {
        value: { type: String, default: "" },
        public: { type: String, default: "" }
    },
    alignment: { type: String, default: "" },
    appearance: { type: String, default: "" },
    trait: { type: String, default: "" },
    ideal: { type: String, default: "" },
    bond: { type: String, default: "" },
    flaw: { type: String, default: "" },
    level: { type: Number, default: 0 },
    xp: {
        value: { type: Number, default: 0 },
    }
},
{ _id: false })

const traitsSchema = new mongoose.Schema({
    size: { type: String, default: "med" },
    //damage immunities
    di: {
        bypasses: [],
        value: [],
        custom: { type: String, default: "" }
    },
    //damage resistances
    dr: {
        bypasses: [],
        value: [],
        custom: { type: String, default: "" }
    },
    //damage vulnerabilities
    dv: {
        bypasses: [],
        value: [],
        custom: { type: String, default: "" }
    },
    //condition immunities
    ci: {
        value: [],
        custom: { type: String, default: "" }
    },
    languages: {
        value: [],
        custom: { type: String, default: "" }
    },
    weaponProf: {
        value: [],
        custom: { type: String, default: "" }
    },
    armorProf: {
        value: [],
        custom: { type: String, default: "" }
    }
},
{ _id: false })

const characterSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        img: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        level: { type: Number, default: 1 },
        class: { type: String, default: "" },
        race: { type: String, default: "" },
        items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }],
        system: {
            abilities: {
                str: { type: abilitySchema, default: () => ({}) },
                dex: { type: abilitySchema, default: () => ({}) },
                con: { type: abilitySchema, default: () => ({}) },
                int: { type: abilitySchema, default: () => ({}) },
                wis: { type: abilitySchema, default: () => ({}) },
                cha: { type: abilitySchema, default: () => ({}) },
            },
            skills: {
                acr: { type: skillSchema, default: () => ({ ability: "dex" })},
                ani: { type: skillSchema, default: () => ({ ability: "wis" })},
                arc: { type: skillSchema, default: () => ({ ability: "int" })},
                ath: { type: skillSchema, default: () => ({ ability: "str" })},
                dec: { type: skillSchema, default: () => ({ ability: "cha" })},
                his: { type: skillSchema, default: () => ({ ability: "int" })},
                ins: { type: skillSchema, default: () => ({ ability: "wis" })},
                itm: { type: skillSchema, default: () => ({ ability: "cha" })},
                inv: { type: skillSchema, default: () => ({ ability: "int" })},
                med: { type: skillSchema, default: () => ({ ability: "wis" })},
                nat: { type: skillSchema, default: () => ({ ability: "int" })},
                prc: { type: skillSchema, default: () => ({ ability: "wis" })},
                prf: { type: skillSchema, default: () => ({ ability: "cha" })},
                per: { type: skillSchema, default: () => ({ ability: "cha" })},
                rel: { type: skillSchema, default: () => ({ ability: "int" })},
                slt: { type: skillSchema, default: () => ({ ability: "dex" })},
                ste: { type: skillSchema, default: () => ({ ability: "dex" })},
                sur: { type: skillSchema, default: () => ({ ability: "wis" })}
            },
            attributes: { type: attributeSchema, default: () => ({}) },
            details: { type: detailsSchema, default: () => ({}) },
            traits: { type: traitsSchema, default: () => ({}) },
            bonuses: { type: bonusSchema, default: () => ({}) },
            currency: {
                pp: { type: Number, default: 0 },
                gp: { type: Number, default: 0 },
                ep: { type: Number, default: 0 },
                sp: { type: Number, default: 0 },
                cp: { type: Number, default: 0 }
            },
            spells: { type: spellSlotSchema, default: () => ({}) }
        }
    },
    {
        toJSON: { virtuals: true, transform: transformDocument },
        toObject: { virtuals: true, transform: transformDocument }
    }
)

characterSchema.pre("save", async function (next) {
    await this.populate('items');
    // Update level
    this.level = this.system?.details?.level || 1;

    // Update race
    const raceItem = this.items.find(item => item.type === 'race');
    this.race = raceItem ? raceItem.name : '';

    // Update class
    const classItems = this.items
        .filter(item => item.type === 'class')
        .map(item => item.name);
    this.class = classItems.join(', ');

    // Update available slots
    const slots = this.system?.spells;
    if (slots) {
        for (const key of Object.keys(slots)) {
            const slot = slots[key];
            if (slot && typeof slot.value === 'number') {
                if (slot.available == null) {
                    slot.available = slot.value;
                }
            }
        }
    }

    // Update max HP
    const hp = this.system?.attributes?.hp;
    if (hp && hp.max == null) {
        hp.max = hp.value;
    }

    next();
});

characterSchema.post("save", function (error, doc, next) {
    //Missing key Tretment
    if (error.name === "ValidationError") {
        const field = Object.keys(error.errors)[0];
        return next(new MissingFieldError(field, `${field} é um campo obrigatório`));
    }
    next(error);
});

characterSchema.post("validate", function (error, doc, next) {
    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      return next(new MissingKeyError(field, `${field} é um campo obrigatório`));
    }
  
    next(error);
});

characterSchema.post("save", async function (doc) {
    await User.findByIdAndUpdate(doc.user, {
        $inc: { 'stats.characters': 1 }
    });
});

characterSchema.post("findOneAndDelete", async function (doc) {
    if (doc) {
        await Item.deleteMany({ character: doc._id });
    };
    
    await User.findByIdAndUpdate(doc.user, {
        $inc: { 'stats.characters': -1 }
    });
});

module.exports = mongoose.model('Character', characterSchema);