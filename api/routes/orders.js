const express = require('express');
const mongoose = require('mongoose');
const Order = require('../models/orders.js');
const Product = require('../models/products.js');
const app = express();

app.get('/', (req, res, next) => {
    Order.find().select('productName').exec()
        .then(result => {
            res.status(200).json({
                message: "Orders List:",
                orders: result.map(el => ({
                    productId: el.productId,
                    response: {
                        type: 'GET',
                        url: `localhost:3000/orders/${el._id}`
                    }
                }))
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

app.get('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId).populate('productId', 'name').exec()
        .then(result => {
            res.status(200).json({
                message: "Orders List:",
                result: result,
                request: {
                    type: 'GET',
                    url: `localhost:3000/products/${result.productId}`
                }
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});

app.post('/', (req, res, next) => {
    Product.findById(req.body.productId).exec()
        .then(result => {
            const order = new Order({
                _id: mongoose.Types.ObjectId(),
                productId: req.body.productId,
                quantity: req.body.quantity
            });
            order.save()
                .then(result => {
                    res.status(201).json({
                        message: "Order Created!",
                        result: {
                            productId: result.productId,
                            quantity: result.quantity
                        },
                        request: {
                            type: "GET",
                            url: `localhost:3000/orders/${result._id}`
                        }
                    });
                })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});


app.patch('/:orderId', (req, res, next) => {
    const orderId = req.params.orderId;
    const updateProps = {};
    for (const order of req.body) {
        updateProps[order.propName] = order.value;
    }
    Order.update({ _id: orderId }, { $set: updateProps }).exec()
        .then(result => {
            res.status(201).json({
                message: "Product " + orderId + " updated!",
                result: result
            });
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});


module.exports = app;