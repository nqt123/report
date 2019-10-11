
var SupportManagerSchema = new mongoose.Schema({
  typeOfCause: { type: String, require: true },
  detailCause: { type: String, default: "" },
  contentHandle: { type: String, default: "" },
  offerSolution: { type: String, default: "" },
  typeOfIncident: { type: String, default: "" },
  statusAfterHandle: { type: String, default: "" },
  reportId: { type: mongoose.Schema.Types.ObjectId }
}, { id: false, versionKey: 'v' });

SupportManagerSchema.plugin(require('mongoose-aggregate-paginate'))
SupportManagerSchema.set('toJSON', { getters: true });
module.exports = mongoose.model('SupportManager', SupportManagerSchema);