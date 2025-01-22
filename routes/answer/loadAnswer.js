var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config()
const { ObjectId } = require('mongodb');;

const Database = require('../../db/conn.js');

/* Get my answer from db */
router.post('', async (req, res) => {

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        /*if(!req.body.testId){
            return res.status(400).send({
                error: 'Didnt got any testId'
            });
        }*/

        if(!req.body.questionId){
            return res.status(400).send({
                error: 'Didnt got any testId'
            });
        }


        if(!req.user.email){
            return res.status(400).send({
                error: 'Didnt got any user email'
            });
        }

        const filter = {
            questionId: req.body.questionId,
            studentId: req.user.email
        }

        const want = {
            projection:{
                _id:0,
                answer:1
            }
        }

        let answer = await Database.db.collection(process.env.ANSWER_COLLECTION).findOne(filter, want)

        console.log("Found answer: ", answer)

        if(!answer) {
            return res.status(400).send({
                error:"There is no such an answer"
            })
        }

        return res.status(200).send({
            answer: answer.answer
        })

    } catch (error) {
        res.status(400).send({
            code: error.code,
            error: error.message
        });
    }
    
})


module.exports = router;