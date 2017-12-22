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
const authenticate = require('./routes/authenticate').router;
const routing = require('./routes/routing');

// Routes
app.use('/', index);
app.use('/shippingCost', shippingCost);
app.use('/discount', discount);
app.use('/authenticate', authenticate);
app.use('/routing', routing);


module.exports = app;
