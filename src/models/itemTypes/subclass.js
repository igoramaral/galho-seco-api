const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { value: { type: String, default: "" } },
    identifier: { type: String, default: "" },
    classIdentifier: { type: String, default: "" },
    spellcasting: {
        progression: { type: String, default: "" },
        ability: { type: String, default: "" },
        preparation: {
            formula: { type: String, default: "" },
        },
    },
}, { _id: false });

const SubclassSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false });

module.exports = Item.discriminator("subclass", SubclassSchema);