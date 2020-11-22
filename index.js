const winston = require('winston');
const express = require('express');
const app = express();

// Error Logging 
require('./startup/logging')();
// run all middleware
require('./startup/middleware')(app);
// run all routes Middleware
require('./startup/routes')(app); //will implement all the routes
// Connect to mongodb 
require('./startup/db')();
// check environment
require('./startup/config')();
// Joi validation
require('./startup/validation')();
// production middleware
require('./startup/prod')(app);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
    winston.info(`Listening to port :${PORT}`);
});

module.exports = server;