var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const Database = require('../../db/conn.js');
const { ErrorMessages } = require('../../public/stylesheets/messages/error-messages.js');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'images/pfp')
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname);
      cb(null, uniqueSuffix+ext)
    }
  })

const upload = multer({storage: storage});

/* Update user information*/
router.post('', upload.single('pfp'), async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        const user = JSON.parse(req.body.user);
        const filter = { email: req.user.email };
        let updateDocument;

       if(req.file){
          updateDocument = {
            $set: {
              name: user.name,
              description: user.description,
              pfp: 'http://localhost:'+process.env.PORT+'/'+req.file.destination+'/'+req.file.filename
            },
        };
       } else{
          updateDocument = {
            $set: {
              name: user.name,
              description: user.description
            },
        };
       }

        let collection = await Database.db.collection(process.env.USER_COLLECTION);
        let result = await collection.updateOne(filter, updateDocument);
        console.log(result);

        res.status(201).send({
          message: 'User successfully updated!'
        });

    } catch (error) {
      console.log(error);
        res.status(400).send({
            message: 'User update went wrong!'
        });
    }
})

module.exports = router;