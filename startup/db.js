const winston = require('winston');
const mongoose = require('mongoose');
const config = require('config');
module.exports = function () {
    //Connect to mongodb 
    const mongoDbUrl = config.get('db');
    mongoose.connect(mongoDbUrl, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true})
        .then(() => winston.info(`Connected to ${mongoDbUrl}`));
        //.catch((err) => console.error('Error ', err));
};