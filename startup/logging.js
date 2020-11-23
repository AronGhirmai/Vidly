require('express-async-errors');
const winston = require('winston');
module.exports = function() {

    winston.add(
        new winston.transports.Console({ format: winston.format.combine(winston.format.colorize(),winston.format.simple(), winston.format.timestamp())}),
        new winston.transports.File({ filename: 'log/logfile.log', 
                                            format: winston.format.combine
                                                        (   
                                                            winston.format.timestamp({format: 'YYYY-MM-DD hh:mm:ss A ZZ'}),
                                                            winston.format.json()                               
                                        )})); //catches exception from the express request
    //to catch all uncaught exceptions
    process.on('uncaughtException', (ex) => {
        console.log("Uncaught Exception");
        winston.error(ex.message, ex);
        process.exit(1);
    });
    //to catch unhandled promises rejection and send it to uncaughtException
    process.on('unhandledRejection', (ex) =>{
        throw ex;
    });

};