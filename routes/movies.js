const {Movie, validate, validId} = require('../models/movie');
const {Genre} = require('../models/genre');
const isUser = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


// View all  
router.get('/', async (req, res) => {
    // res.send(genres);
    const movies = await Movie.find().sort('title');
    res.send(movies);
});

// view only selected (id)
router.get('/:id', async (req, res) => {
    
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    const movie = await Movie.findById(req.params.id).catch((err) => console.error("Error:",err));
     
    if(!movie) return res.status(404).send('The Selected index does not exist'); 

    res.send(movie);
});

// add to the list
router.post('/', isUser, async (req, res) => {
    var {error} = validate(req.body);
    if(error) 
    {
        var error_message = "";
        error.details.forEach(c => error_message += c.message+"\n");
        return res.status(400).send(error_message);
    }

    const genre = await Genre.findById(req.body.genreId).catch((err) => console.error("Error",err));

    if(!genre) return res.status(400).send("Invalid Genre"); 
    
    let movie = Movie({ 
        title: req.body.title, 
        numberInStock: req.body.numberInStock, 
        dailyRentalRate: req.body.dailyRentalRate,
        genre: {
            name: genre.name,
            _id: genre._id
        } 
    });
    movie = await movie.save();
    res.send(movie);
});

//edit an element in the list
router.put('/:id', isUser, async (req, res) => {
    //check that the input name is valid
    var {error} = validate(req.body);
    if(error) 
    {
        var error_message = "";
        error.details.forEach(c => error_message += c.message+"\n");
        return res.status(400).send(error_message);
    }

    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    const genre = await Genre.findById(req.body.genreId);

    if(!genre) return res.status(400).send("Invalid Genre"); 
    
    //check that the id is valid
    const movie = await Movie.findByIdAndUpdate(req.params.id, { 
            title: req.body.title, 
            numberInStock: req.body.numberInStock, 
            dailyRentalRate: req.body.dailyRentalRate,
            genre: {
                name: genre.name,
                _id: genre._id
            } 
        }, { new: true }).catch((err) => console.error("Error:",err));  
    
    if(!movie) return res.status(400).send('The requested id does not exits.');

    res.send(movie);
});

//delete an element from the list
router.delete('/:id', isUser, async (req, res) => {
    //check that the id is valid
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    const movie = await Movie.findByIdAndRemove(req.params.id)
                    .catch((err) => console.error("Error:",err));  

    if(!movie) return res.status(400).send('The requested id does not exits.');

    res.send(movie);
});

module.exports = router;