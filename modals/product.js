const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true,
    },
    price : {
    },
    description : {
        type : String,
        required : true,
    },
    images : [{
        type: String,
    }],
    creator : {
        type: mongoose.SchemaTypes.ObjectId,
        ref : "User"
    }
})

productSchema.set('toJSON', {getters: true});
const Product = mongoose.model('Product',productSchema)


module.exports = Product