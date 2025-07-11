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
        subtype: { type: String, default: "" },
    },
    damage: {
        base: {
            number: { type: Number, default: 0 },
            denomination: { type: Number, default: 0 },
            bonus: { type: String, default: "" },
            types: [],
        },
    },
}, { _id: false });

const ConsumableSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("consumable", ConsumableSchema);