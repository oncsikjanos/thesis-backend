var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* add student to test */
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.body.testId){
            return res.status(400).send({
                error:'Didnt got any testId'
            })
        }

        const currentDate = new Date();

        let testFilter = {
            startableFrom: { $gte: currentDate },
            _id: new ObjectId(req.body.testId),
            status: 'finished'
        }

        applyQuery = {
            $push :{
                students: req.user.email
            }
        }

        await Database.db.collection(process.env.TEST_COLLECTION).updateOne(testFilter, applyQuery);

        const addToResult = {
            student: req.user.email,
            testId: req.body.testId,
            status: 'not started',
            canFillTill: null,
            answers: [],
            result: null
        }

        await Database.db.collection(process.env.RESULT_COLLECTION).insertOne(addToResult);

        return res.status(200).send({
            message: 'Apllied succesfully to the exam!'
        });


    } catch (error) {
      console.log(error);
      res.status(400).send({
          message: 'Test update went wrong!'
      });
    }
})

module.exports = router;