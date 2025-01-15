var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
const multer = require('multer');

const Database = require('../../db/conn.js');
const { ErrorMessages } = require('../../public/stylesheets/messages/error-messages.js');

const storage = multer.memoryStorage();
const upload = multer({ storage });

//const imageSchema

/* Register a new user */
router.post('', async (req, res) => {
    console.log(req.body);

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        test = req.body;
        console.log(req.file);

        for(question in test.questions){
            if(question.picture){

            }
        }
        
        let collection = await Database.db.collection(process.env.TEST_COLLECTION);
        //let result = await collection.

    } catch (error) {
        res.status(400).send({
            "code": error.code,
            "message": ErrorMessages.AUTH.FIREBASE[error.code]
        });
    }

        res.status(200).send({
            message: "got it"
        })
})



module.exports = router;
