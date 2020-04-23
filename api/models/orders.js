const mongoose = require('mongoose');

const ordersSchema = {
    _id: mongoose.SchemaTypes.ObjectId,
    productId: {type: mongoose.SchemaTypes.ObjectId, ref: 'Product', required: true},
    quantity: {type: Number, default: '1', required: true}
}

module.exports = mongoose.model('Order', ordersSchema)