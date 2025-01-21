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

        const resultQuery = {
            testId: req.body.testId,
            student: req.user.email,
            $or: [
                { $and:[
                    {status:'not started'},
                    {canFillTill: null},
                ]},
                {$and:[
                    {status:'started'},
                    {canFillTill: {$gte: currentDate}}
                ]}
            ],
        };

        const result = await Database.db.collection(process.env.RESULT_COLLECTION).findOne(resultQuery)

        if(!result){
            return res.status(400).send({
                error:'Cant take this test'
            })
        }

        if(result.canFillTill){
            return res.status(200).send({
                message:'You already started this test',
                end: result.canFillTill,
            });
        }

        const testQuery = {
            _id: new ObjectId(req.body.testId),
            status: 'finished'
        }

        const want = {
            projection:{
                _id:0,
                duration:1
            },
            $and: [
                { startableFrom: { $lte: currentDate } },
                { startableTill: { $gte: currentDate } }
            ],
        }

        testData = await Database.db.collection(process.env.TEST_COLLECTION).findOne(testQuery, want)

        if(!testData){
            return res.status(400).send({
                error: 'Something went wrong during starting the test!'
            });
        }

        const newFillTill = new Date();
        newFillTill.setTime(newFillTill.getTime() + testData.duration * 60000);

        const setResult = {
            $set: {
                canFillTill: newFillTill,
                status: 'started',
                result: 0
            }
        }

        const updateResult = await await Database.db.collection(process.env.RESULT_COLLECTION).updateOne(result, setResult)

        return res.status(200).send({
            message:'Started this test',
            end: newFillTill
        });

    } catch (error) {
      console.log(error);
      res.status(400).send({
          error: 'Something went wrong during getting access!'
      });
    }
})

module.exports = router;