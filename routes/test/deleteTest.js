var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config()
const { ObjectId } = require('mongodb');
const fs = require('fs');

const Database = require('../../db/conn.js');

/* Delete test from db*/
router.post('', async (req, res) => {

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        if(!req.body.testId){
            res.status(400).send({
                error: 'Didnt got any test id'
            });
            return;
        }

        testFilter = {
            _id: new ObjectId(req.body.testId)
        };

        let testCollection = await Database.db.collection(process.env.TEST_COLLECTION);

        const foundTest = await testCollection.findOne(testFilter);

        if(!foundTest){
            res.status(400).send({
                error: "Got wrong test Id"
            });
            return;    
        }

        let questionCollection = await Database.db.collection(process.env.QUESTION_COLLECTION);

        for(question of foundTest.questions){
            questionFilter = {
                _id: new ObjectId(question)
            };

            
        const foundQuestion = await questionCollection.findOne(questionFilter);

        if(foundQuestion.picture){
            const location = foundQuestion.picture.split('http://localhost:5050/');
            if(fs.existsSync(location[1])){
                fs.unlinkSync(location[1]);
            }
            }

            await questionCollection.deleteOne(questionFilter);

        }

        await testCollection.deleteOne(testFilter);

        res.status(201).send({
            message: 'Test succesfully deleted',
        });


    } catch (error) {
        res.status(400).send({
            code: error.code,
            error: error.message
        });
    }
})


module.exports = router;