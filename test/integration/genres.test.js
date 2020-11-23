const request = require('supertest');
const {Genre} = require('../../models/genre');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const config = require('config');
const { User } = require('../../models/user');
const { response } = require('express');
let server;

describe('/api/genre',() => {
    
    beforeEach(()=>{ server = require('../../index'); });
    afterEach(async()=>{ 
        await server.close();
        await Genre.deleteMany({}); 
    });

    describe('GET /', () => {
        it('Should return all genres', async () =>{
 
            await Genre.collection.insertMany([
                { name: 'Genre1' },
                { name: 'Genre2' }
            ]);

            const res = await request(server).get('/api/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(q => q.name === 'Genre1')).toBeTruthy();
            expect(res.body.some(q => q.name === 'Genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('Should return a single genre', async () => {
            const genre = Genre({ name: 'Genre1'});
            await genre.save();
            
            
            const res = await request(server).get('/api/genres/'+genre._id);
            
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);
        });

        it('Should return 404 if _id is valid but not present in db', async () => {
            // const genre = Genre({ name: 'Genre1'});
            // await genre.save();
            
            const _id = mongoose.Types.ObjectId().toHexString();

            const res = await request(server).get('/api/genres/'+_id);
            
            expect(res.status).toBe(404 );
        });

        it('Should return 400 if _id is invalid', async () => {
            // const genre = Genre({ name: 'Genre1'});
            // await genre.save();
            
            const _id = '1';

            const res = await request(server).get('/api/genres/'+_id);
            
            expect(res.status).toBe(400);
        });

    });
    describe('POST /', () => {
        it('Should return 401 if no user token provided', async () => {

            const res = await request(server).post('/api/genres').send({ name: 'genre1' });

            expect(res.status).toBe(401);
        });

        it('Should return 400 if invalid user token provided', async () => {
            const token = jwt.sign({ _id: mongoose.Types.ObjectId(), isAdmin: true}, 'fakeTokenKey');
            const res = await request(server).post('/api/genres').set('x-auth-token',token).send({ name: 'genre1' });

            expect(res.status).toBe(400);
        });

        it('Should return 200 if valid user token provided and add the new genre', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/genres').set('x-auth-token',token).send({ name: 'genre1' });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name','genre1');
            expect(res.body).toHaveProperty('_id');
        });

        it('Should save the genre if it is valid', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/genres').set('x-auth-token',token).send({ name: 'genre1' });

            const genre = await Genre({name: 'genre1'});
            expect(genre).not.toBeNull();

        });

        it('Should return 400 because name of genre is too short (less than 3)', async () => {
            const token = new User().generateAuthToken();
            const res = await request(server).post('/api/genres').set('x-auth-token',token).send({ name: 'ab' });

            expect(res.status).toBe(400);
        });

        it('Should return 400 because name of genre is too long (more than 50)', async () => {
            const token = new User().generateAuthToken();
            const str = Array(52).join('a'); //gives 51 'a's
            const res = await request(server).post('/api/genres').set('x-auth-token',token).send({ name: str });

            expect(res.status).toBe(400);
        });
    });

    describe('PUT /:id', () => {
        let token;
        let name;
        let id;
        
        const exec = async () => {
            return request(server).put('/api/genres/' + id).set('x-auth-token',token).send({name: name});
        };
        
        beforeEach(async () =>{
            token = new User().generateAuthToken();
            name = 'Genre1';
            const genre = Genre({name: 'Genre1'});
            id = genre._id;
            await genre.save();
        });

        it('Should return 401 if user is not logged in', async () =>{
            token = '';
            name = 'Genre2';
    
            const res = await exec();

            expect(res.status).toBe(401);
        });

        it('Should return 200 and change the name property', async () =>{
            name = 'Genre2';

            const res = await exec();

            expect(res.status).toBe(200);
            // expect(res.body).toMatchObject(genre);
            expect(res.body).toHaveProperty('name','Genre2');
        });

        it('Should return 400 if the change name is too short (less than 3)', async () => {
            name = 'aa';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 400 if the supplied id is invalid', async () => {
            id = '1';

            const res = await exec();

            expect(res.status).toBe(400);
        });

        it('Should return 404 if the supplied id is valid but does not exit in db' , async () =>{
            id = mongoose.Types.ObjectId();

            const res = await exec();

            expect(res.status).toBe(404);
        });
    });

    describe('DELETE /:id', () => {
        let token;
        let id;
        let genre; 
        const exec = async () => {
           return request(server).delete('/api/genres/' + id).set('x-auth-token',token);
        };

        beforeEach(async ()=>{
            const user = {isAdmin:true};
            token = new User(user).generateAuthToken();
            genre = Genre({name:'Genre1'});
            id = genre._id;
            await genre.save();
        });

        it('Should delete the field and return status 200', async()=>{   
            const res = await exec();

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name',genre.name);
            
            const genre_check = Genre.findById(genre._id);
            expect(genre_check).not.toHaveProperty('name',genre._id);

        });

        it('Should return 400 if invalid id supplied', async()=>{   
            id = '1';
            const res = await exec();

            expect(res.status).toBe(400);

        });

        it('Should return 404 if the supplied id is valid but does not exist', async()=>{   
            id = mongoose.Types.ObjectId();
            const res = await exec();

            expect(res.status).toBe(404);

        });

        it('Should return 403 if the user is not admin', async()=>{   
            user = {isAdmin:false};
            token = new User(user).generateAuthToken();
            const res = await exec();

            expect(res.status).toBe(403);
            //expect 

        });
    
    });
});