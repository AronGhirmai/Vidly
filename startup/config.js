const config = require('config');

module.exports = function() {
    //Set environmental variable with you private key, else the program won't start.
    if (!config.get('jwtPrivateKey')){
        throw new Error("FATAL ERROR: Please set the JWT private key this environment. ('Export' for Mac/linux and 'Set' for windows");
    }   
};