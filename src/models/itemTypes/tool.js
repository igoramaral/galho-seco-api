const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { 
        value: { type: String, default: "" } 
    },
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
    ability: { type: String, default: "" },
    proficient: { type: Number, default: null },
    bonus: { type: String, default: "" },
    type: {
        value: { type: String, default: "" },
        baseItem: { type: String, default: "" },
    },
    attuned: { type: Boolean, default: false },
    properties: []
}, { _id: false });

const ToolSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
});

module.exports = Item.discriminator("tool", ToolSchema);
