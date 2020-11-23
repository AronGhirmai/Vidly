const bcrypt = require('bcrypt');
const Joi = require('joi');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async(req, res) => {
    var {error} = validate(req.body);
    if(error) 
    {
        var error_message = "";
        error.details.forEach(c => error_message += c.message+"\n");
        return res.status(400).send(error_message);
    }
    let user = await User.findOne({ email: req.body.email });
    if(!user) return res.status(400).send('Incorrect Username or Password.');
    
    const  validPass = await bcrypt.compare(req.body.password,user.password);

    if(!validPass) return res.status(400).send('Incorrect Username or Password.');

    const token = user.generateAuthToken();

    res.send(token);
    
});

function validate(req)
{
    const schema = Joi.object({
        //  
        email: Joi.string().trim().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required()
    });

    return schema.validate(req);
}
module.exports = router;