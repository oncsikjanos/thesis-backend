var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const Database = require('../../db/conn.js');

/* get tests from data base which is in finished */
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }
        const currentDate = new Date();

        console.log(req.body)

        console.log(currentDate);

        let testFilter = {
            startableFrom: { $gte: currentDate },
            status: 'finished'
        }

        if(req.body.subject){
            testFilter.subject = req.body.subject
        }

        if(req.body.date){
            //console.log(new Date(req.body.date));
            const reqDate = new Date(req.body.date)
            if(reqDate > currentDate){
                testFilter.startableFrom = {$gte :new Date(req.body.date)}
            }
            console.log(testFilter);
           
        }

        const dontWantQuery = {
            projection: {
                questions: 0,
                poinDeduction: 0,
                startableTill: 0,
                status: 0,
                duration: 0
            }
        }

        let foundTests = await Database.db.collection(process.env.TEST_COLLECTION).find(testFilter, dontWantQuery).toArray();

        const wantedQuery = {
            projection: {
                _id: 0,
                name: 1
            }
        }

        for(let test of foundTests){
            
            const filter = {
                email: test.teacher,
                role: 'admin'
            }
            //console.log(test);

            foundTeacher = await Database.db.collection(process.env.USER_COLLECTION).findOne(filter, wantedQuery);
            console.log(foundTeacher);
            test.name = foundTeacher.name;
            console.log(test)
        }

        if(!foundTests || !foundTests.length){
            return res.status(200).send({ 
                message: 'No tests found',
                tests: foundTests
            });
        }

        return res.status(200).send({ 
            message: 'Tests found',
            tests: foundTests
        });

    } catch (error) {
      console.log(error);
        res.status(400).send({
            message: 'In progress test getting went wrong!',
            error: error.message
        });
    }
})

module.exports = router;