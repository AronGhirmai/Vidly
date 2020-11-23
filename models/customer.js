const Joi = require('joi');
const mongoose = require('mongoose');

// const customerSchema = mongoose.Schema({
//     name: { type: String, required: true, minlength: 3, maxlength: 30},
//     isGold: {type: Boolean, default: false},
//     phone:  { type: String, required: true, minlength: 3, maxlength: 30},
// });
const customerSchema = mongoose.Schema({
    name: { type: String, required: true, minlength: 3, maxlength: 30},
    isGold: {type: Boolean, default: false},
    phone:  { type: String, required: true, minlength: 3, maxlength: 30},
});
const Customer = mongoose.model('Customer', customerSchema);

function validateCustomer(customer)
{
    const schema = Joi.object({
        name: Joi.string().trim().min(3).max(50).required(),
        phone: Joi.string().trim().min(3).max(50).required(),
        isGold: Joi.boolean()
    });

    return schema.validate(customer);
}

function validId(id)
{
    return mongoose.Types.ObjectId.isValid(id);
}
module.exports.Customer = Customer;
module.exports.validate = validateCustomer;
module.exports.validId = validId;
module.exports.customerSchema = customerSchema;