const mongoose = require('mongoose')

const SupportEmailSchema = new mongoose.Schema({
  name: { type: String, trim: true },
  location: { type: String, trim: true },
  email: { type: String, trim: true, required : true },
  displayName: { type: String, trim: true }
}, { timestamps: true })

SupportEmailSchema.set('toJSON', { getters: true });
const SupportEmail = mongoose.model('SupportEmail', SupportEmailSchema)

module.exports = SupportEmail