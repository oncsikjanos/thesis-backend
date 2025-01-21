var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Finish a videocall */
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
            status:'not started',
        };

        const result = await Database.db.collection(process.env.RESULT_COLLECTION).findOne(resultQuery)

        if(!result){
            return res.status(200).send({
                error: 'Test already attended'
            });
        }

        const data = {
            $set:{
                status: 'finished'
            }
        }

        await Database.db.collection(process.env.RESULT_COLLECTION).updateOne(result, data)

        return res.status(200).send({
            message: 'Set to finished'
        });

    } catch (error) {
      console.log(error);
      return res.status(400).send({
          error: 'Something went wrong during finishing!'
      });
    }
})

module.exports = router;