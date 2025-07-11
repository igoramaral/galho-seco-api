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
    armor: {
        value: { type: Number, default: 10 },
        dex:  { type: Number, default: 0 },
        magicalBonus: { type: Number, default: null }
    },
    hp: {
        value: { type: Number, default: 10 },
        max:  { type: Number, default: 0 },
    },
    speed: {
        value: { type: Number, default: 10 }
    },
    strength: { type: Number, default: null },
    proficient: { type: Number, default: null},
}, { _id: false });

const EquipmentSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("equipment", EquipmentSchema);