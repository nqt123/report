const mongoose = require('mongoose')

const SlaMenuSchema = new mongoose.Schema({
  name: { type: String, trim : true },
  displayName: { type: String, trim : true }
}, { timestamps: true })

SlaMenuSchema.set('toJSON', { getters: true });
SlaMenuSchema.plugin(require('mongoose-aggregate-paginate'))
const SlaMenu = mongoose.model('slaMenu', SlaMenuSchema)

module.exports = SlaMenu