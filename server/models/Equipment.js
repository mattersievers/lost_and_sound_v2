const { Schema } = require('mongoose');

const equipmentSchema = new Schema({
    category: { type: String, required: true },
    brand: { type: String, required: true },
    model: { type: String, required: true },
    description: { type: String, required: true },
    serialNumber: { type: String, required: true },
    image: { type: [String], required: true },
    location: { type: String, required: true },
    lost: {type: Boolean, required: true }
});

module.exports = equipmentSchema;