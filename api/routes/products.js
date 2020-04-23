const express = require("express");
const mongoose = require('mongoose');
const Product = require('../models/products.js');
const checkAuth = require('../middleware/auth.js');
const app = express();


app.get('/', (req, res, next) => {
    Product.find().select('name').limit(10).exec()
        .then(result => {
            res.status(200).json({
                message: "Products list: ",
                products: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

app.get('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).exec()
        .then(result => {
            res.status(200).json({
                message: "Product with id: " + productId,
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            })
        })
})

app.post('/', checkAuth, (req, res, next) => {
    const product = new Product({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        expiration: req.body.expiration
    })
    product
        .save()
        .then(result => {
            res.status(201).json({
                message: "Product Added Successfully!",
                result: result
            })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            })
        });
})

app.delete('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    Product.findById(productId).deleteOne()
        .then(result => {
            res.status(201).json({
                message: "Product deleted successfully!",
                result: result
            })
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
})

app.patch('/:productId', (req, res, next) => {
    const productId = req.params.productId;
    let updateProps = {};
    for (let ops of req.body) {
        updateProps[ops.propName] = ops.value;
    }

    Product.update({ _id: productId }, { $set: updateProps }).exec()
        .then(result => {
            res.status(201).json({
                message: "Product Updated Successfully!",
                result: result
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({
                error: err
            });
        })
})

module.exports = app;