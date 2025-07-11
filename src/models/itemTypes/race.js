const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { value: { type: String, default: "" } },
    identifier: { type: String, default: "" },
    movement: {
        burrow: { type: Number, default: null },
        climb: { type: Number, default: null },
        fly: { type: Number, default: null },
        swim: { type: Number, default: null },
        walk: { type: Number, default: null },
        hover: { type: Number, default: null },
        units: { type: String, default: "ft" },
    },
    senses: {
        darkvision: { type: Number, default: null },
        blindsight: { type: Number, default: null },
        tremorsense: { type: Number, default: null },
        truesight: { type: Number, default: null },
        special: { type: Number, default: null },
        units: { type: String, default: "ft" },
    },
    type: {
        value: { type: String, default: "" },
        subtype: { type: String, default: "" },
        custom: { type: String, default: "" } 
    },
    advancement: []
}, { _id: false });

const RaceSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("race", RaceSchema);