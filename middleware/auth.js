const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (req, res, next) {
    const token = req.header("X-AUTH-token");
    if(!token) return res.status(401).send("Access Denied. No token Provided.");

    try 
    {
        const decode = jwt.verify(token, config.get('jwtPrivateKey'));
        req.user = decode;

        next();
    }
    catch(ex)
    {
        return res.status(400).send("Invalid Token");
    }
};