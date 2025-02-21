const mongoose = require('mongoose');

const abilitySchema = new mongoose.Schema({
    value: { type: Number, default: 10 },
    proficient: { type: Number, default: 0 },
    max: { type: Number, default: null },
    bonuses: {
        check: { type: String, default: "" },
        save: { type: String, default: "" }
    }
})

const skillSchema = new mongoose.Schema({
    value: { type: Number, default: 0 },
    ability: { type: String, required: true },
    bonuses: {
        check: { type: String, default: "" },
        passive: { type: String, default: "" }
    }
})

const spellSlotSchema = new mongoose.Schema({
    spell1: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell2: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell3: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell4: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell5: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell6: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell7: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell8: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    spell9: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    },
    pact: {
        value: { type: Number, default: 0 },
        override: { type: Number, default: null }
    }
})

const attributeSchema = new mongoose.Schema({
    hp: {
        value: { type: Number, default: 0 },
        max: { type: Number, default: 0 },
        temp: { type: Number, default: 0 },
        tempmax: { type: Number, default: 0 },
    },
    ini: {
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
})

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
    race: { type: String, default: "" },
    background: { type: String, default: "" },
    originalClass: { type: String, default: "" },
    level: { type: Number, default: 0 },
    xp: {
        value: { type: Number, default: 0 },
    }
})

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
})

const characterSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        type: { type: String, default: "character" },
        img: { type: String, default: "" },
        user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User' },
        items: {
            type: []
        },
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
            currency: {
                pp: { type: Number, default: 0 },
                gp: { type: Number, default: 0 },
                ep: { type: Number, default: 0 },
                sp: { type: Number, default: 0 },
                cp: { type: Number, default: 0 }
            }
        }
    }
)

module.exports = mongoose.model('Character', characterSchema);