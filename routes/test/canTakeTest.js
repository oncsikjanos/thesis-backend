var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get a test */
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.user.email){
            return res.status(400).send({
                error:'Not authenticated'
            })
        }

        if(!req.body.testId){
            return res.status(400).send({
                error:'Didnt got testId'
            })
        }
        
        const currentDate = new Date();

        const testQuery = {
            _id: new ObjectId(req.body.testId),
            $or : [
                { students: req.user.email },
                { teacher: req.user.email }
            ],
            $and: [
                { startableFrom: { $lte: currentDate } },
                { startableTill: { $gte: currentDate } }
            ],
            status: 'finished'
        };

        const tests = await Database.db.collection(process.env.TEST_COLLECTION).find(testQuery).toArray();


        if(!tests){
            return res.status(400).send({
                error:'Wrong testId'
            })
        }

        if(tests.length !== 1){
            return res.status(400).send({
                error:'You cant take this exam, or expired'
            })
        }

        return res.status(200).send({
            type: tests[0].videocall ? 'videocall' : 'test'
        });

    } catch (error) {
      console.log(error);
      res.status(400).send({
          error: 'Something went wrong during getting access!'
      });
    }
})

module.exports = router;