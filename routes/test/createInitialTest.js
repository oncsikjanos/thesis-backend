var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const Database = require('../../db/conn.js');

/* Create initial instance for test object */
router.get('', async (req, res) => {

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        if(!req.user.email){
            res.status(400).send({
                error: 'Didnt got any user email'
            });
            return;
        }

        test = {
            subject: '',
            status:'creation',
            startableFrom: new Date(),
            startableTill: new Date(),
            duration: 0,
            pointDeduction: 0,
            limit: 20,
            videocall : false,
            questions: [],
            students: [],
            teacher: req.user.email
        }

        let collection = await Database.db.collection(process.env.TEST_COLLECTION);
        let result = await collection.insertOne(test);

        console.log(result);

        res.status(201).send({
            message: 'Initial test succesfully. created',
            id: result.insertedId
        });


    } catch (error) {
        res.status(400).send({
            code: error.code,
            error: error.message
        });
    }
})


module.exports = router;