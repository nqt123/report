var AgentStatusLogSchema = new mongoose.Schema({
    startTime: {type: Date, default: null},
    endTime: {type: Date, default: null},
    agentId: {type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null},
    status: {type: Number, default: 1}
}, {id: false, versionKey: 'v'});
AgentStatusLogSchema.plugin(require('mongoose-aggregate-paginate'));
AgentStatusLogSchema.set('toJSON', {getters: true});
module.exports = mongoose.model('AgentStatusLog', AgentStatusLogSchema);