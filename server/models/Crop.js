const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema(
  {
    farmer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true },
    pricePerUnit: { type: Number, required: true },
    unit: { type: String, required: true, default: 'kg' },
    quantityAvailable: { type: Number, required: true },
    district: { type: String, required: true },
    harvestDate: { type: Date, required: true },
    imageEmoji: { type: String, default: '🌾' },
    status: { type: String, enum: ['available', 'sold_out'], default: 'available' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Crop', cropSchema);
