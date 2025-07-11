const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { value: { type: String, default: "" } },
    identifier: { type: String, default: "" },
    quantity: { type: Number, default: 1 },
    weight: {
        value: { type: Number, default: 0 },
        units: { type: String, default: "" },
    },
    price: {
        value: { type: Number, default: 0 },
        denomination: { type: String, default: "" },
    },
    attunement: { type: String, default: "" },
    equipped: { type: Boolean, default: false },
    rarity: { type: String, default: "commom" },
    attuned: { type: Boolean, default: false },
    properties: [],
    type: {
        value: { type: String, default: "" },
        baseItem: { type: String, default: "" },
    },
    damage: {
        base: {
            number: { type: Number, default: 0 },
            denomination: { type: Number, default: 0 },
            bonus: { type: String, default: "" },
            types: [],
        },
        versatile: {
            number: { type: Number, default: null },
            denomination: { type: Number, default: 0 },
            bonus: { type: String, default: "" },
            types: [],
        },
    },
    armor: {
        value: { type: Number, default: 10 }
    },
    hp: {
        value: { type: Number, default: 10 },
        max:  { type: Number, default: 0 },
    },
    magicalBonus: { type: Number, default: null },
    ammunition: {},
}, { _id: false });

const WeaponSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("weapon", WeaponSchema);