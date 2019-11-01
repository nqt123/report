
let ResponseListSchema = new mongoose.Schema({
    typeOfCause: { type: String, require: true },
    detailCause: { type: String, default: "" },
    contentHandle: { type: String, default: "" },
    offerSolution: { type: String, default: "" },
    statusAfterHandle: { type: String, default: "" },
    reportId: { type: mongoose.Schema.Types.ObjectId },
    responseId: { type: mongoose.Schema.Types.ObjectId }
},{timestamps:true});

module.exports = mongoose.model("ResponseList",ResponseListSchema);