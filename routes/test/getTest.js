var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const fs = require('fs');

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get a test */
router.post('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.body.testId){
            return res.status(400).send({
                error:'Didnt got any testId'
            })
        }

        const query = {
            _id:  new ObjectId(req.body.testId),
            teacher: req.user.email
        }

        foundTest = await Database.db.collection(process.env.TEST_COLLECTION).findOne(query);

        if(!foundTest){
            return res.status(400).send({
                error:'Wrong testId'
            })
        }

        return res.status(200).send({
            test: foundTest
        })

    } catch (error) {
      console.log(error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
          message: 'Question update went wrong!'
      });
    }
})

module.exports = router;