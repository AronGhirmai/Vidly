const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = mongoose.Schema({
    movie: {
        type: mongoose.Schema({
            title: {
                type: String,
                required: true,
                trim: true,
                minlength: 1,
                maxlength: 255
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true,
    },
    customer:{
        type: mongoose.Schema({
            name: { type: String, required: true, minlength: 3, maxlength: 30},
            isGold: {type: Boolean, default: false},
            phone:  { type: String, required: true, minlength: 3, maxlength: 30},
        }),
        required: true
    },
    dateOut: {
        type: Date,
        default: Date.now
    },
    dateReturned: {
        type: Date
    },
    rentalFee:{
        type: Number,
        min: 0
    }
});

// when movie returned assign the return date and calculate rentalFee
rentalSchema.methods.return = function() {
    this.dateReturned = Date.now();
    
    
    const daysRentedOut = moment().diff(this.dateOut,'days');
    this.rentalFee = daysRentedOut * this.movie.dailyRentalRate;
}

const Rental = mongoose.model('Rental', rentalSchema);


function validateRental(rental)
{
    const schema = Joi.object({
        movieId: Joi.objectId().required(),
        customerId: Joi.objectId().required(),
    });

    return schema.validate(rental);
}
// function validId(id)
// {
//     return mongoose.Types.ObjectId.isValid(id);
// }
module.exports.Rental = Rental;
module.exports.validate = validateRental;