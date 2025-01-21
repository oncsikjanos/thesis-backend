var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const fs = require('fs');

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get a test */
router.get('', async (req, res) => {
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
        
        const currentDate = new Date();

        const testQuery = {
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

        const dontWantQuery = {
            projection: {
                questions: 0,
                poinDeduction: 0,
                status: 0,
                duration: 0,
                students: 0,
            }
        };

        const tests = await Database.db.collection(process.env.TEST_COLLECTION).find(testQuery, dontWantQuery).toArray();

        const wantedQuery = {
            projection: {
                _id: 0,
                name: 1
            }
        }

        for(let test of tests){
            
            const filter = {
                email: test.teacher,
                role: 'admin'
            }

            const foundTeacher = await Database.db.collection(process.env.USER_COLLECTION).findOne(filter, wantedQuery);
            test.name = foundTeacher.name;
        }

        if(!tests){
            return res.status(400).send({
                error:'Wrong testId'
            })
        }

        return res.status(200).send({
            tests: tests
        });

    } catch (error) {
      console.log(error);
      res.status(400).send({
          error: 'Something went wrong during getting exams!'
      });
    }
})

module.exports = router;