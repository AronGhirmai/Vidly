//const helmet = require('helmet'); // Middleware: helps you secure your Express apps by setting various HTTP headers
const morgan = require('morgan'); // Middleware: HTTP request logger middleware 
const express = require('express');

module.exports = function(app) {
    app.use(morgan('tiny'));
    app.use(express.json());
    //app.use(helmet()); //set in prod middleware
    app.use(express.static('public'));
};