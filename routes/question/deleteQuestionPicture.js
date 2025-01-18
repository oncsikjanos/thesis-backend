var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const multer = require('multer');
const fs = require('fs');

const { ObjectId } =  require('mongodb');

const Database = require('../../db/conn.js');

/* delete picture from question*/
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.body.questionId){
            return res.status(400).send({ 
                error: 'Didnt get question Id' 
            });
        }

        const questionFilter = {
            _id: new ObjectId(req.body.questionId)
        }

        let foundQuestion = await Database.db.collection(process.env.QUESTION_COLLECTION).findOne(questionFilter);

        if(!foundQuestion){
            return res.status(400).send({ 
                error: 'There is no question with this Id' 
            });
        }

        if (foundQuestion.picture) {
            console.log('already has picture')
            const location = foundQuestion.picture.split('http://localhost:5050/');
            console.log(location);
            if(fs.existsSync(location[1])){
                fs.unlinkSync(location[1]);
            }
        }

        const updatePictureQuery = {
            $set: {
              picture: null
            },
        };

        let pictureAddResult =await Database.db.collection(process.env.QUESTION_COLLECTION).updateOne(questionFilter, updatePictureQuery);

        console.log(pictureAddResult);

        res.status(201).send({
          message: 'Picture succesfully deleted!'
        });

    } catch (error) {
      console.log(error);
        res.status(400).send({
            message: 'Question picture renmove went wrong!'
        });
    }
})

module.exports = router;