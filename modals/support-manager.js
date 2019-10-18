
var SupportManagerSchema = new mongoose.Schema({
    typeOfCause:{type:String,require:true},
    detailCause:{type:String,default:""},
    contentHandle:{type:String,default:""},
    offerSolution:{type:String,default:""},
    statusAfterHandle:{type:String,default:""},
    reportId:{type:mongoose.Schema.Types.ObjectId}
},{ timestamps: { createdAt: 'createdAt' } },{id: false, versionKey: 'v'});

module.exports = mongoose.model('SupportManager',SupportManagerSchema);