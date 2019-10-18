const mongoose = require('mongoose')

const SlaListSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId },
  processTime: { type: Number, trim: true }
}, { timestamps: true })

SlaListSchema.set('toJSON', { getters: true });
const SlaList = mongoose.model('SlaList', SlaListSchema)

module.exports = SlaList