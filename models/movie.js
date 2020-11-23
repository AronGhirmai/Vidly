const Joi = require('joi');
const mongoose = require('mongoose');
const {genreSchema} = require('./genre');



const movieSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        maxlength: 255
    },
    numberInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255
    },
    genre: {
        type: genreSchema,
        required: true
    }
});
const Movie = mongoose.model('Movie', movieSchema);


function validateMovie(movie)
{
    const schema = Joi.object({
        title: Joi.string().trim().min(1).max(255).required(),
        numberInStock: Joi.number().min(0).max(255).required(),
        dailyRentalRate: Joi.number().min(1).max(255).required(),
        genreId: Joi.objectId().required()
    });

    return schema.validate(movie);
}
function validId(id)
{
    return mongoose.Types.ObjectId.isValid(id);
}
module.exports.Movie = Movie;
module.exports.validate = validateMovie;
module.exports.validId = validId;
module.exports.movieSchema = movieSchema;