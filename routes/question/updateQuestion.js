var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const fs = require('fs');

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Update test */
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.body.questionId){
            return res.status(400).send({
                error:'Didnt got any questionId'
            })
        }

        if(!req.body.questionData){
            return res.status(400).send({
                error:'Didnt got any question data'
            })
        }

        const filter = {
            _id:  new ObjectId(req.body.questionId)
        }

        console.log(filter);

        // Remove the `_id` field from the update data, if present
        const { _id, ...updateData } = req.body.questionData;

        console.log(updateData)

        const updateQuestionQuery = {
            $set: updateData
        }

        let updateQuestionResult = await Database.db.collection(process.env.QUESTION_COLLECTION).updateOne(filter, updateQuestionQuery);

        if(!updateQuestionResult){
            return res.status(400).send({
                error:'Wrong questionId'
            })
        }

        return res.status(200).send({
           question: updateQuestionResult
        })

    } catch (error) {
      console.log(error);
      res.status(400).send({
          message: 'Question update went wrong!'
      });
    }
})

module.exports = router;