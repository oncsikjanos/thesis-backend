var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const Database = require('../../db/conn.js');

/* get tests from data base which is in progress, and the requester user owns it */
router.get('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.user.email){
            return res.status(400).send({ 
                error: 'Didnt get email' 
            });
        }

        const testFilter = {
            teacher: req.user.email,
            status: 'creation'
        }

        let foundTests = await Database.db.collection(process.env.TEST_COLLECTION).find(testFilter).toArray();

        for(test in foundTests){
            console.log(test);
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