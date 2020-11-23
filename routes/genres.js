const {Genre, validate, validId} = require('../models/genre');
const express = require('express');
const isUser = require('../middleware/auth');
const isAdmin = require('../middleware/admin');
const mongoose = require('mongoose');
const router = express.Router();


// View all  
router.get('/', async (req, res) => {
    // res.send(genres);
    // throw new Error("Error from Genre getter");
    const genres = await Genre.find().sort('name');
    return res.send(genres);
});

// view only selected (id)
router.get('/:id', async (req, res) => {
    // const genre = genres.find(c => {if(c.id === parseInt(req.params.id)){return true;}else{return false;}})
    // const genre = genres.find(c => c.id === parseInt(req.params.id));
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");

    const genre = await Genre.findById(req.params.id);//.catch((err) => console.error("Error:",err));
     
    if(!genre) return res.status(404).send('The Selected index does not exist'); 

    return res.send(genre);
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
    let genre = Genre({ name: req.body.name  });
    genre = await genre.save();
    return res.send(genre);
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
    //check if the id is valid
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    //check that the id exists
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true });//.catch((err) => console.error("Error:",err));  
    
    if(!genre) return res.status(404).send('The requested id does not exits.');

    return res.send(genre);
});

//delete an element from the list
router.delete('/:id', [isUser, isAdmin], async (req, res) => {
    //check that the id is valid
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    
    const genre = await Genre.findByIdAndRemove(req.params.id);//.catch((err) => console.error("Error:",err));  

    if(!genre) return res.status(404).send('The requested id does not exits.');

    return res.send(genre);
});

module.exports = router;