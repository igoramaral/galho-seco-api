const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { value: { type: String, default: "" } },
    identifier: { type: String, default: "" },
    properties: [],
    activation: {
        type: { type: String, default: ""},
        condition: { type: String, default: ""},
        value: { type: Number, default: 1},
    },
    duration: {
        value: { type: String, default: ""},
        units: { type: String, default: ""},
    },
    range: {
        value: { type: String, default: ""},
        units: { type: String, default: ""},
        special: { type: String, default: ""},
    },
    level: { type: Number, default: 0},
    school: { type: String, default: ""},
    materials: {
        value: { type: String, default: ""},
        consumed: { type: Boolean, default: false},
        cost: { type: Number, default: 0},
        supply: { type: Number, default: 0},
    },
    preparation: {
        mode: { type: String, default: ""},
        prepared: { type: Boolean, default: false},
    }
}, { _id: false });

const SpellSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("spell", SpellSchema);