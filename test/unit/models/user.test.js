const {User} = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe("Generate Auth token test",() => {
    it('Should return a valid JWT', ()=>{
        const payload = { _id: new mongoose.Types.ObjectId().toHexString(), isAdmin: true};
        const user = User(payload);
        
        const token = user.generateAuthToken();

        const decode = jwt.verify(token, config.get('jwtPrivateKey'));

        expect(decode).toMatchObject(payload);
    });
    
});