const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user.js');

const app = express();

app.post('/signup', (req, res, next) => {
    User.find({ email: req.body.email })
        .then(result => {
            if (result.length >= 1) {
                return res.status(409).json({
                    message: "Email exists"
                });
            }
            else {
                bcrypt.hash(req.body.password, 7, (err, hash) => {
                    if (err) {
                        return res.status(500).json({
                            message: "Failed to Encrypt"
                        });
                    }
                    else {
                        const user = new User({
                            _id: mongoose.Types.ObjectId(),
                            email: req.body.email,
                            password: hash
                        });
                        user.save()
                            .then(result => {
                                console.log(result),
                                    res.status(201).json({
                                        message: "User Added!"
                                    });
                            })
                            .catch(err => {
                                res.status(500).json({
                                    error: err
                                })
                            })
                    }
                })
            }
        })
        .catch(err => {
            res.status(500).json({
                error: err
            });
        })
});


app.post('/login', (req, res, next) => {
    User.findOne({ email: req.body.email })
        .then(user => {
            if (user.length < 1) {
                res.status(401).json({
                    message: "Auth Failed"
                });
            }
            else {
                bcrypt.compare(req.body.password, user.password, (err, same) => {
                    if (same) {
                        const token = jwt.sign(
                            {
                                email: user.email,
                                id: user._id
                            },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1h"
                            }
                        );
                        return res.status(200).json({
                            message: "Auth Succeeded",
                            token: token
                        });
                    }
                    res.status(401).json({
                        message: "Auth Failed"
                    });
                })
            }
        })
        .catch(err => {
            console.log(err)
            res.status(401).json({
                message: "Auth Failed"
            });
        });
});

module.exports = app;