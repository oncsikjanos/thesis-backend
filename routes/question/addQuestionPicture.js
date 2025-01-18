var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { ObjectId } =  require('mongodb');

const Database = require('../../db/conn.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/questionPicture')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix+ext)
    }
  })

const upload = multer({storage: storage});

/* add picture to question*/
router.post('', upload.single('picture'), async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        console.log(req.file)

        if(!req.file){
            return res.status(400).send({ 
                error: 'Didnt get any picture' });
        }

        console.log(req.body.questionId)

        if(!req.body.questionId){
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
          return res.status(400).send({ 
            error: 'Didnt get question Id' 
          });
        }

        const questionFilter = {
            _id: new ObjectId(req.body.questionId)
        }

        let foundQuestion = await Database.db.collection(process.env.QUESTION_COLLECTION).findOne(questionFilter);

        if(!foundQuestion){
          if (req.file && fs.existsSync(req.file.path)) {
            fs.unlinkSync(req.file.path);
          }
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
              picture: 'http://localhost:'+process.env.PORT+'/'+req.file.destination+'/'+req.file.filename
            },
        };

        let pictureAddResult =await Database.db.collection(process.env.QUESTION_COLLECTION).updateOne(questionFilter, updatePictureQuery);

        console.log(pictureAddResult);

        res.status(201).send({
          message: 'Picture succesfully updated!',
          picture: 'http://localhost:'+process.env.PORT+'/'+req.file.destination+'/'+req.file.filename
        });

    } catch (error) {
      console.log(error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
          error: 'Question update went wrong!'
      });
    }
})

module.exports = router;