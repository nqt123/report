const mongoose = require('mongoose')

const reportSchema = new mongoose.Schema({
  name: {
    type: mongoose.Schema.Types.ObjectId
  },
  displayName: {
    type: String
  },
  position: {

  },
  CRM: {

  },
  type: {

  },
  title: {
    type: String
  },
  description: {
    type: String
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
  seen: {
    type: Boolean,
    default: false
  },
  for: [{
    type: mongoose.Schema.Types.ObjectId
  }],
  supportseen: [{
    name: {
      type: String
    },
    id: {
      type: mongoose.Schema.Types.ObjectId
    }
  }],
  reason: [
    
  ],
  processTime: {
    type: Number,
    default: 0
  },
  typeDisplay: {
    type: String
  },
  lastRespondAt : {
    type : Date,
    default:''
  },
  endAt: {
    type: Date
  },
  uniqueId: {
    type: Number,
    unique: true,
  }
}, { timestamps: { createdAt: 'createdAt' } })

reportSchema.plugin(require('mongoose-aggregate-paginate'))
reportSchema.set('toJSON', { getters: true });
const Report = mongoose.model('Report', reportSchema)

module.exports = Report