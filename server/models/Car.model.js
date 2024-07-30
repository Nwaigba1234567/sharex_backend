const { Schema, model } = require("mongoose");

const carSchema = new Schema ({
    name: { 
        type: String
    },
    doors: { 
        type: String
    },
    type: { 
        type: String
    },
    seat: { 
        type: String
    },
    imageUrl: { 
        type: String
    },
    availableUnits: { 
        type: Number
    },
    price: {
        type: String
    },
    rating: {
        type: String
    },
    contact: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },

})

const CarModel = model("Car", carSchema);
module.exports = CarModel;