const mongoose = require('mongoose')

const SlaListSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  category: { type: mongoose.Schema.Types.ObjectId },
  processTime: { type: Number, trim: true },
  note: { type: String, trim: true, default : '' }
}, { timestamps: true })

SlaListSchema.set('toJSON', { getters: true });

SlaListSchema.plugin(require('mongoose-aggregate-paginate'))
const SlaList = mongoose.model('SlaList', SlaListSchema)

module.exports = SlaList