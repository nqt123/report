const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  position: {

  },
  CRM: {

  },
  type: {

  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  agentNumberInShift: {
    type: Number
  },
  agentNumberInfluence: {
    type: Number
  },
  percentOfInfluence: {
    type: Number
  },
  prior: {
    type: Number
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
  },
  status: {
    type: String,
    default: 0
  },
  state: {
    type: String
  },
  late: {
    type: Boolean
  },
  supporter: {
    name: {

    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  },
  reason : {
    type: String
  }
}, { timestamps: { createdAt: 'createdAt' } })

reportSchema.plugin(require('mongoose-aggregate-paginate'))
reportSchema.set('toJSON', { getters: true });
const Report = mongoose.model('Report', reportSchema)

module.exports = Report