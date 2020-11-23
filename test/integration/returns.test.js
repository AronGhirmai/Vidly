const request = require('supertest');
const {Rental} = require('../../models/rental');
const {Movie} = require('../../models/movie');
const {User} = require('../../models/user');
const mongoose = require('mongoose');
const moment = require('moment');
let server;
let rental;
let movie;
let customerId;
let movieId;
let token; 
let dateOut;
let dateReturned;
describe('/api/returns', () => {
    
    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({ customerId, movieId});
    };
    beforeEach(async () => { 
        server = require('../../index'); 
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        token = User().generateAuthToken();
        dateOut = null;
        dateReturned = null;
        
        movie = Movie({
            _id: movieId,
            title: 'movie',
            dailyRentalRate: 2,
            numberInStock: 5,
            genre: {
                name: 'Genre1'
            }
        });
        await movie.save();

        rental = Rental({
            customer: {
                _id: customerId,
                name: 'abcde',
                phone: '12345',
            },
            movie: {
                _id: movieId,
                title: 'movie',
                dailyRentalRate: 2
            }
        });
        await rental.save();
    });
    afterEach( async () => { 
        await server.close();
        await Rental.deleteMany({});  
        await Movie.deleteMany({});  
    });


    it('should return 401 if client is not logged in', async () => {
        // const res = await Rental.findById(rental._id); 
        token = '';

        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customer Id not provided', async () => {
        // const res = await Rental.findById(rental._id); 
        customerId = '';

        const res = await exec();


        expect(res.status).toBe(400);
    });

    it('should return 400 if movie Id not provided', async () => {
        // const res = await Rental.findById(rental._id); 
        movieId = '';

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if customer and movie combination not found', async () => {
        customerId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if Rental already processed', async () => {
        // const res = await Rental.findById(rental._id); 
        //let rent = await Rental.findByIdAndUpdate(rental._id,{'dateReturned': Date.now()}, { new: true });
        rental.dateReturned = Date.now();
        await rental.save();
        //rent.push({'dateReturned': Date.now()});
        // await rent.save();
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if we have a valid request', async () => {        
        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set the return date if input is valid', async () => {        
        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);
        const timeDiff = Date.now() - rentalInDb.dateReturned;

        expect(res.status).toBe(200);
        expect(timeDiff).toBeLessThan(10 * 1000);

    });

    it('The rental fee should be calculated', async () => {        
        rental.dateOut = moment().add(-7,'days').toDate(); 
        await rental.save();

        const res = await exec();

        const rentalInDb = await Rental.findById(rental._id);

        expect(res.status).toBe(200);
        expect(rentalInDb.rentalFee).toBe(14); //dailyrental rate = 2 and dateout= 7days ago

    });

    it('The stock of the movie should be increased', async () => {        
        const res = await exec();

        const movieInDb = await Movie.findById(movie._id);

        expect(res.status).toBe(200);
        expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1); 

    });

    it('The rental should be returned in the body of the response', async () => {        
    
        const res = await exec();

    
        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('customer'); 
        expect(res.body).toHaveProperty('movie'); 
        expect(res.body).toHaveProperty('dateOut'); 
        expect(res.body).toHaveProperty('dateReturned'); 
        expect(res.body).toHaveProperty('rentalFee'); 

    });
});