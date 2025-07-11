const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { value: { type: String, default: "" } },
    identifier: { type: String, default: "" },
    levels: { type: Number, default: 1 },
    spellcasting: {
        progression: { type: String, default: "" },
        ability: { type: String, default: "" },
        preparation: {
            formula: { type: String, default: "" },
        },
    },
    wealth: { type: String, default: "" },
    primaryAbility: {
        value: [],
        all: { type: Boolean, default: true },
    },
    hd: {
        denomination: { type: String, default: "d6" },
        spent: { type: Number, default: 0 },
        additional: { type: String, default: "" },
    },
}, { _id: false });

const ClassSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("class", ClassSchema);