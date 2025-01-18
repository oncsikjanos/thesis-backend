var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const Database = require('../../db/conn.js');
const { ObjectId } = require('mongodb');

/* get question from db*/
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.user.email){
            return res.status(400).send({ 
                error: 'Didnt get email' 
            });
        }

        if(!req.body.questionId){
            return res.status(400).send({ 
                error: 'Didnt get any questionId' 
            });
        }

        const questionFilter = {
            _id: new ObjectId(req.body.questionId)
        }

        let question = await Database.db.collection(process.env.QUESTION_COLLECTION).findOne(questionFilter);


        if(!question){
            return res.status(400).send({ 
                error: 'No question found',
            });
        }

        return res.status(200).send({ 
            question: question
        });

    } catch (error) {
      console.log(error);
        res.status(400).send({
            message: 'Something went wrong getting the question!',
            error: error.message
        });
    }
})

module.exports = router;