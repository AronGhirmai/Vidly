const Joi = require('joi');
const mongoose = require('mongoose');



const genreSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});
const Genre = mongoose.model('Genre', genreSchema);


function validateGenre(genre)
{
    const schema = Joi.object({
        // _id: Joi.objectId(),
        name: Joi.string().trim().min(3).max(50).required()
    });

    return schema.validate(genre);
}
function validId(id)
{
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.validId = validId;
module.exports.genreSchema = genreSchema;