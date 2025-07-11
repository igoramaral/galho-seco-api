const Item = require("../item");
const mongoose = require("mongoose");

const SystemSchema = new mongoose.Schema({
    description: { value: { type: String, default: "" } },
    identifier: { type: String, default: "" },
    properties: [],
    uses: {
        max: { type: String, default: "" },
        recovery: [],
        spent: { type: Number, default: 0 },
    },
    type: {
        value: { type: String, default: "" },
        subtype: { type: String, default: "" },
    },
    requirements: { type: String, default: "" },
    enchant: {}
}, { _id: false });


const FeatSchema = new mongoose.Schema({
    system: { type: SystemSchema, default: () => ({}) }
},{ _id: false })

module.exports = Item.discriminator("feat", FeatSchema);