const {Customer, validate, validId} = require('../models/customer');
const isUser = require('../middleware/auth');
const express = require('express');
const mongoose = require('mongoose'); 
const router = express.Router();

// View all  
router.get('/', async (req, res) => {
    // res.send(genres);
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// view only selected (id)
router.get('/:id', async (req, res) => {

    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");

    const customer = await Customer.findById(req.params.id).catch((err) => console.error("Error:",err));
     
    if(!customer) return res.status(404).send('The Selected index does not exist'); 

    res.send(customer);
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
    let customer = Customer({ 
        name: req.body.name, 
        phone: req.body.phone,
        isGold: req.body.isGold
     });
    customer = await customer.save();
    res.send(customer);
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
    //check that the id is valid
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    const customer = await Customer.findByIdAndUpdate(req.params.id, { 
        name: req.body.name,
        phone: req.body.phone,
        isGold: req.body.isGold 
    }, { new: true }).catch((err) => console.error("Error:",err));  
    
    if(!customer) return res.status(400).send('The requested id does not exits.');

    res.send(customer);
});

//delete an element from the list
router.delete('/:id', isUser, async (req, res) => {
    //check that the id is valid
    if(!validId(req.params.id)) return res.status(400).send("Invalid Id");
    const customer = await Customer.findByIdAndRemove(req.params.id).catch((err) => console.error("Error:",err));  

    if(!customer) return res.status(400).send('The requested id does not exits.');

    res.send(customer);
});


module.exports = router; 