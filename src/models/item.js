const mongoose = require("mongoose");

const ItemBaseSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        foundryId: { type: String, default: "" },
        type: {
            type: String,
            required: true,
            enum: [
                "background",
                "class",
                "consumable",
                "equipment",
                "feature",
                "loot",
                "race",
                "spell",
                "subclass",
                "tool",
                "weapon",
            ],
        },
        system: { Object, default: {} },
        character: { type: mongoose.Schema.Types.ObjectId, ref: 'Character', required: true },
    },
    {
        discriminatorKey: "type",
        _id: true,
    }
);

module.exports = mongoose.model("Item", ItemBaseSchema);












    


    



