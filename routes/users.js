const bcrypt = require('bcrypt');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const isUser = require('../middleware/auth');
const express = require('express');
const { route } = require('./genres');
const router = express.Router();

router.get('/me', isUser, async (req, res) => {
    // the req.user._id is populated in hasAuthorization middleware
    const user = await User.findById(req.user._id).select('-password');
    res.send(user);
});

router.post('/', async(req, res) => {
    var {error} = validate(req.body);
    if(error) 
    {
        var error_message = "";
        error.details.forEach(c => error_message += c.message+"\n");
        return res.status(400).send(error_message);
    }
    let user = await User.findOne({ email: req.body.email });
    if(user) return res.status(400).send('User already registered');
    
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password,salt);
    user = User({ 
        name: req.body.name,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: hash      
    });
    await user.save();

    const token = user.generateAuthToken();

    res.header('X-AUTH-token', token).send({
        _id: user._id,
        name: user.name,
        email: user.email
    });
});

module.exports = router;