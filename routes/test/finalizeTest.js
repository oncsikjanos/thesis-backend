var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Set test to finished */
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

        const filter = {
            _id:  new ObjectId(req.body.testId),
            teacher: req.user.email
        }

        console.log(filter);

        console.log(req.body.testData)

        const updateTestQuery = {
            $set: {
                status:'finished'
            }
        }

        let updateTestResult = await Database.db.collection(process.env.TEST_COLLECTION).updateOne(filter, updateTestQuery);

        if(!updateTestResult){
            return res.status(400).send({
                error:'Wrong testId'
            })
        }

        return res.status(200).send({
            test: updateTestResult
        })

    } catch (error) {
      console.log(error);
      res.status(400).send({
        error: 'Test finalization went wrong!'
      });
    }
})

module.exports = router;