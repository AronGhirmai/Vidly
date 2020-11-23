const winston = require('winston');

module.exports = function (err, req, res, next) {
    console.log("Error Was Thrown",err);
    winston.error(err.message,err);   //error, warn, info, verbos, debug, silly
    res.status(500).send("Error was Thrown");
};