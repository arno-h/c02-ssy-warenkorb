const express = require('express');
const logger = require('morgan');

// Generic application setup
const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));


// Load routes into variables
const index = require('./routes/index');
const shippingCost = require('./routes/shippingCost');
const discount = require('./routes/discount');

// Routes
app.use('/', index);
app.use('/shippingCost', shippingCost);
app.use('/discount', discount);


module.exports = app;
