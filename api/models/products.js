const mongoose = require('mongoose');

const productSchema = {
    _id: mongoose.SchemaTypes.ObjectId,
    name: {type: String, required: true},
    expiration: {type: Number, required: true}
}

module.exports = mongoose.model('Product', productSchema)