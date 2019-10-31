const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  offTime: {

  },
  CRM: {
    type: Boolean,
    default: false
  },
  Voice: {
    type: Boolean,
    default: false
  },
  Chat: {
    type: Boolean,
    default: false
  },
  Email: {
    type: Boolean,
    default: false
  },
  smartIVR: {
    type: Boolean,
    default: false
  },
  SMS: {
    type: Boolean,
    default: false
  },
  hardware: {
    type: Boolean,
    default: false
  },
  connection: {
    type: Boolean,
    default: false
  },
  IP: {
    type: String
  },
  agentNumber: {
    type: Number
  },
  PM: {

  },
  TL: {

  }
}, { timestamps: { createdAt: 'createdAt' } })

projectSchema.plugin(require('mongoose-aggregate-paginate'))
projectSchema.set('toJSON', { getters: true });
const ProjectAdmin = mongoose.model('ProjectAdmin', projectSchema)

module.exports = ProjectAdmin