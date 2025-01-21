var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const fs = require('fs');

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get questions for exam */
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        /*if(!req.user.email){
            return res.status(400).send({
                error:'Not authenticated'
            })
        }*/

        if(!req.body.testId){
            return res.status(400).send({
                error:'Didnt got TestId'
            })
        }
        
        const currentDate = new Date();

        const testQuery = {
            _id: new ObjectId(req.body.testId),
            students: req.user.email,
            $or: [
                { startableFrom: { $gte: currentDate } },
                {
                    $and: [
                        { startableFrom: { $lte: currentDate } },
                        { startableTill: { $gte: currentDate } }
                    ]
                }
            ],
            status: 'finished'
        };

        const wantQuery = {
            projection: {
                _id: 0,
                questions: 1,
                subject: 1
            }
        };

        const test = await Database.db.collection(process.env.TEST_COLLECTION).findOne(testQuery, wantQuery);

        //const questions = []
        if(!test){
            return res.status(400).send({
                error: 'You cant take this exam!'
            })
        }

        const questionIds = test.questions.map(id => new ObjectId(id));

        const questionQuery = {
            _id: { $in: questionIds } 
        }

        const dontWant = {
            projection: 
            { 
                goodOption: 0 
            } 
        }

        const questions = await Database.db.collection(process.env.QUESTION_COLLECTION).find(questionQuery, dontWant).toArray();

        if(!questions || !questions.length){
            return res.status(400).send({
                error: 'You cant take this exam!'
            })
        }

        for(let q of questions){
            if(q.type === 'yes or no'){
                const newOpts = []
                if(q.options){
                    for(let option of q.options){
                        newOpts.push(option.text);
                    }

                    q.options = newOpts;
                }
            }
        }

        return res.status(200).send({
            questions: questions,
            //end: new Date('2025.01.22'),
            subject: test.subject
        });

    } catch (error) {
      console.log(error);
      res.status(400).send({
          error: 'Something went wrong during getting exams!'
      });
    }
})

module.exports = router;