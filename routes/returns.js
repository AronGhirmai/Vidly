const express = require('express');
const router = express.Router();
const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const isUser = require('../middleware/auth');

// View all  
router.post('/', isUser, async (req, res) => {
    var {error} = validate(req.body);
    if(error) 
    {
        var error_message = "";
        error.details.forEach(c => error_message += c.message+"\n");
        return res.status(400).send(error_message);
    }

    const rental = await Rental.findOne({'customer._id': req.body.customerId, 'movie._id': req.body.movieId});

    if(!rental) return res.status(404).send('Customer Movie combination not found');

    if(rental.dateReturned) return res.status(400).send('The Rental is already processed');

    rental.return();
    await rental.save();

    // const movie = await Movie.findById(rental.movie._id);
    // movie.numberInStock += 1;
    // await movie.save();
    //or
    await Movie.update({_id: rental.movie._id} , {
        $inc: {numberInStock: 1}
    });
    
    return res.status(200).send(rental);
});

module.exports = router;