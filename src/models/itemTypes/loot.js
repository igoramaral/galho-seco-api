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
    rarity: { type: String, default: "commom" },
    properties: [],
    type: {
        value: { type: String, default: "" },
        subtype: { type: String, default: "" },
    },
}, { _id: false });

const LootSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("loot", LootSchema);