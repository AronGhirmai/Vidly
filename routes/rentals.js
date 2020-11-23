const {Rental, validate} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');
const express = require('express');
const mongoose = require('mongoose');
const Fawn = require('fawn');
const router = express.Router();


Fawn.init(mongoose);
// View all  
router.get('/', async (req, res) => {
    // res.send(genres);
    const rentals = await Rental.find().sort('-dateOut');
    res.send(rentals);
});


// add to the list
router.post('/', async (req, res) => {
    var {error} = validate(req.body);
    if(error) 
    {
        var error_message = "";
        error.details.forEach(c => error_message += c.message+"\n");
        return res.status(400).send(error_message);
    }
    // check if the customer exists
    const customer = await Customer.findById(req.body.customerId).catch((err) => console.error("Error",err));

    if(!customer) return res.status(400).send("Invalid Customer id"); 

    // Check if the movie exists 
    const movie = await Movie.findById(req.body.movieId).catch((err) => console.error("Error",err));

    if(!movie) return res.status(400).send("Invalid Movie id"); 

    if(movie.numberInStock === 0) return res.status(400).send("The Movie is out of Stock");

    let rental = Rental({ 
        movie: {
            _id: movie._id,
            title: movie.title,
            dailyRentalRate: movie.dailyRentalRate
        }, 
        customer:{
            _id: customer._id,
            name: customer.name,
            // isGold: customer.isGold,
            phone: customer.phone
        }
    });
    try{
        Fawn.Task()
            .save('rentals',rental)
            .update('movies',{_id: movie._id},{
                $inc: { numberInStock: -1 }
            })
            .run(); 
    res.send(rental);
    }
    catch(e)
    {
        return res.status(500).sendStatus("Something Failed");
    }
    
});


module.exports = router;