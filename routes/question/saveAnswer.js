var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config()
const { ObjectId } = require('mongodb');;

const Database = require('../../db/conn.js');

/* Save my answer to the db */
router.post('', async (req, res) => {

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        if(!req.body.answer){
            return res.status(400).send({
                error: 'Didnt got any answer'
            });
        }

        if(!req.body.testId){
            return res.status(400).send({
                error: 'Didnt got any testId'
            });
        }

        if(!req.user.email){
            return res.status(400).send({
                error: 'Didnt got any user email'
            });
        }

        const answerReceived = req.body.answer
        answerReceived.points = 0;

        filter = {
            questionId: answerReceived.questionId,
            studentId: req.user.email
        }

        const save = {
            $set : answerReceived
        }

        let answer = await Database.db.collection(process.env.ANSWER_COLLECTION).findOne(filter)

        console.log("Found answer: ", answer)

        if(!answer){
            answerReceived.studentId = req.user.email;
            const creation = await Database.db.collection(process.env.ANSWER_COLLECTION).insertOne(answerReceived)

            console.log("Created answer: ", creation)

        }else{
            const updateResult = await Database.db.collection(process.env.ANSWER_COLLECTION).updateOne(filter, save)

            console.log("Found answer: ", updateResult)

            if(!updateResult){
                return res.status(400).send({
                    error: 'Something went wrong during saving answer'
                });
            }

        }

        const testFilter = {
            _id: new ObjectId(req.body.testId)
        }

        const testQuery = {
            projection: {
                _id: 0,
                pointDeduction: 1
            }
        }

        const pointDeduction = await Database.db.collection(process.env.TEST_COLLECTION).findOne(testFilter, testQuery);

        console.log('PointDeduction: ', pointDeduction)

        if(!pointDeduction){
            return res.status(400).send({
                error: 'There is no such a test'
            });
        }

        const questionFilter = {
            _id: new ObjectId(answerReceived.questionId)
        }

        const question = await Database.db.collection(process.env.QUESTION_COLLECTION).findOne(questionFilter);

        console.log('Found question: ', question)

        if(!question){
            return res.status(400).send({
                error: 'There is no such a question'
            });
        }

        let points = 0;

        /* Calculating asnwer points */
        if(question.type === 'multiple choice'){
            console.log("Question is multiple choice")
            if(question.goodOption === answerReceived.answer){
                points += question.points;
                console.log("Answer is good")
            }
            else if(answerReceived.answer){
                points -= question.points * (pointDeduction.pointDeduction / 100.0)
                console.log("Answer is wrong")
                console.log(points)
            }else{
                console.log("Answer is neutral")
            }
        } 
        else if(question.type === 'yes or no'){
            for(let q of question.options){
                console.log(typeof(answerReceived.answer[q.text]))
                if(q.value === answerReceived.answer[q.text]){
                    points += (question.points / question.options.length);
                    console.log("Answer is good")
                }
                else if(typeof(answerReceived.answer[q.text]) === 'boolean') {
                    points -= (question.points / question.options.length) * (pointDeduction.pointDeduction / 100.0)
                    console.log("Answer is wrong")
                    console.log(points)
                }else{
                    console.log("Answer is neutral")
                }
            }
        }

        const save2 = {
            $set :{
                points: points
            }
        }

        const updateResult2 = await Database.db.collection(process.env.ANSWER_COLLECTION).updateOne(filter, save2)

        console.log("Found answer: ", updateResult2)

        const pointSaveQuery = {
            _id: new ObjectId(req.body.testId),
            students: req.user.email,
            status: 'finished'
        };

        const wantQuery = {
            projection: {
                _id: 0,
                questions: 1,
            }
        };

        const testforPoint = await Database.db.collection(process.env.TEST_COLLECTION).findOne(pointSaveQuery, wantQuery);

        console.log('TEST QUESTIONS: ', testforPoint)

        if(!testforPoint){
            return res.status(400).send({
                error: 'You cant take this exam!'
            })
        }

        const questionIds = testforPoint.questions.map(id => id.toString());

        console.log(questionIds);

        const resultQuery = {
            questionId: { $in: questionIds },
            studentId: req.user.email 
        }

        const wantPoints = {
            projection: 
            { 
                points:1
            } 
        }

        const pointsForResultArray = await Database.db.collection(process.env.ANSWER_COLLECTION).find(resultQuery, wantPoints).toArray();

        console.log('POINTS ARRAY: ',pointsForResultArray);

        let resultPoints = 0;

        for(let p of pointsForResultArray){
            resultPoints+=p.points;
        }

        if(resultPoints < 0){
            resultPoints=0;
        }


        const setPointsQ = {
            testId: req.body.testId,
            studentId: req.body.email 
        }

        const setPoint = {
            $set: { result: resultPoints }
        }

        updateResultForPoint = await Database.db.collection(process.env.RESULT_COLLECTION).updateOne(setPointsQ,setPoint);

        res.status(201).send({
            message: 'Answer succesfully updated',
        });


    } catch (error) {
        res.status(400).send({
            code: error.code,
            error: error.message
        });
    }

})


module.exports = router;