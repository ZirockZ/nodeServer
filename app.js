const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require('mongoose');
const productsRoutes = require('./api/routes/products.js');
const ordersRoutes = require('./api/routes/orders.js');
const usersRoutes = require('./api/routes/users.js');

mongoose.connect(
    `mongodb+srv://admin:${process.env.MONGO_ATLAS_PW}@testcluster-3wwkd.mongodb.net/test?retryWrites=true&w=majority`, 
    {  
        useUnifiedTopology: true,
        useNewUrlParser: true
    }
);

const app = express();

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); //кто может быть источником запроса?
    res.header('Access-Control-Allow-Header', '*'); 
    
    if(req.method == 'OPTIONS'){
        res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, PATCH');    //какие методы могут быть вызваны?
        return res.status(200).json({});
    }

    next();
});

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);
app.use('/users', usersRoutes);

app.use((req, res, next) => {
    let error = new Error('NOT FOUND, BRUH, ITS 404');
    error.status = 404;
    next(error)
})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: error.message
    });
});

module.exports = app;