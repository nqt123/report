
var SupportManagerSchema = new mongoose.Schema({
    typeOfCause:{type:String,require:true},
    detailCause:{type:String,default:""},
    contentHandle:{type:String,default:""},
    offerSolution:{type:String,default:""},
    typeOfIncident:{type:String,default:""},
    statusAfterHandle:{type:String,default:""},
    reportId:{type:String,default:""}
},{id: false, versionKey: 'v'});

module.exports = mongoose.model('SupportManager',SupportManagerSchema);