const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
//todo: password complexity. use joi-password-complexity

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    email:{
        type: String,
        unique: true,
       // validate: function validator(v) {
       //     return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(v);
        //}
    },
    password:{
        type: String,
        required: true,
        minlength: 5,
        maxlength: 255
    },
    isAdmin: Boolean
    //roles: ['Admin', 'Normal'] use instead of isAdmin for system with more roles than Admin and not admin
});

userSchema.methods.generateAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin}, config.get('jwtPrivateKey'));
};

const User = mongoose.model('User', userSchema);

function validateUser(user)
{
    const schema = Joi.object({
        name: Joi.string().trim().min(1).max(255).required(),
        email: Joi.string().trim().min(5).max(255).email().required(),
        password: Joi.string().min(5).max(255).required(),
        isAdmin: Joi.boolean()
    });

    return schema.validate(user);
}


module.exports.User = User;
module.exports.validate = validateUser;