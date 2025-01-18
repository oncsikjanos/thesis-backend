var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config()
const { ObjectId } = require('mongodb');;

const Database = require('../../db/conn.js');

/* Add new question to db*/
router.post('', async (req, res) => {

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        if(!req.body.testId){
            return res.status(400).send({
                error: 'Didnt got any test id'
            });
        }

        if(!req.body.type){
            return res.status(400).send({
                error: 'Didnt got any test type'
            });
        }

        const correctTypes = ['multiple choice' , 'yes or no'];

        if(!correctTypes.includes(req.body.type)){
            return res.status(400).send({
                error: 'Got wrong test type'
            });
        }

        filter = {
            _id: new ObjectId(req.body.testId)
        }

        let collection = await Database.db.collection(process.env.TEST_COLLECTION);
        let findTestById = await collection.findOne(filter);

        if(!findTestById){
            res.status(400).send({
                error: "Got wrong test Id"
            });
            return;    
        }
        
        question = {
            question: '',
            type: req.body.type,
            options: [],
            points: 1,
            goodOption: null,
            picture: null,
        }

        collection = await Database.db.collection(process.env.QUESTION_COLLECTION);
        let result = await collection.insertOne(question);

        collection = await Database.db.collection(process.env.TEST_COLLECTION);

        query = {
            $addToSet: { 
                questions: result.insertedId
            } 
        }

        await collection.updateOne(filter, query);

        res.status(201).send({
            message: 'Question succesfully added',
            id: result.insertedId
        });


    } catch (error) {
        res.status(400).send({
            code: error.code,
            error: error.message
        });
    }
})


module.exports = router;