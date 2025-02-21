const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: "character",
        },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        items: {
            type: []
        },
        system: {
            type: mongoose.Schema.Types.Mixed,
            default: {
                abilities: {
                    str: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 10,
                            proficient: 0,
                            max: null
                        }
                    },
                    dex: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 10,
                            proficient: 0,
                            max: null
                        }
                    },
                    con: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 10,
                            proficient: 0,
                            max: null
                        }
                    },
                    int: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 10,
                            proficient: 0,
                            max: null
                        }
                    },
                    wis: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 10,
                            proficient: 0,
                            max: null
                        }
                    },
                    cha: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 10,
                            proficient: 0,
                            max: null
                        }
                    }
                },
                skills: {
                    acr: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "dex"
                        }
                    },
                    ani: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "wis"
                        }
                    },
                    arc: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "int"
                        }
                    },
                    ath: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "str"
                        }
                    },
                    dec: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "cha"
                        }
                    },
                    his: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "int"
                        }
                    },
                    ins: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "wis"
                        }
                    },
                    itm: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "cha"
                        }
                    },
                    inv: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "int"
                        }
                    },
                    med: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "wis"
                        }
                    },
                    nat: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "int"
                        }
                    },
                    prc: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "wis"
                        }
                    },
                    prf: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "cha"
                        }
                    },
                    per: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "cha"
                        }
                    },
                    rel: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "int"
                        }
                    },
                    slt: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "dex"
                        }
                    },
                    ste: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "dex"
                        }
                    },
                    sur: { 
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            ability: "wis"
                        }
                    }
                },
                attributes: {
                    hp: {
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: 0,
                            temp: 0,
                            tempmax: 0
                        }
                    },
                    death: {
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            success: 0,
                            failure: 0
                        }
                    },
                    inspiration: { type: Boolean, default: false },
                    exhaustion: { type: Number, default: 0},
                    attunement: {
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            max: 3
                        }
                    },
                    ac: {
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            flat: null,
                            calc: "default"
                        }
                    }
                },
                details: {
                    biography: {
                        type: mongoose.Schema.Types.Mixed,
                        default: {
                            value: "",
                            public: ""
                        }
                    },
                    alignment: { type: String, default: "" },
                    appearance: { type: String, default: "" },
                    trait: { type: String, default: "" },
                    ideal: { type: String, default: "" },
                    bond: { type: String, default: "" },
                    flaw: { type: String, default: "" }
                },
                currency: {
                    pp: { type: Number, default: 0 },
                    gp: { type: Number, default: 0 },
                    ep: { type: Number, default: 0 },
                    sp: { type: Number, default: 0 },
                    cp: { type: Number, default: 0 }
                }
            }
        }
    }
)