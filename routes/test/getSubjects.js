var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const fs = require('fs');

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get subjects */
router.get('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        const query = {
            status: 'finished'
        }

        foundTest = await Database.db.collection(process.env.TEST_COLLECTION).find(query).toArray();

        const subjects = [];

        for(let test of foundTest){
            subjects.push(test.subject);
        }

        if(!subjects){
            return res.status(400).send({
                error:'No subjects'
            })
        }

        return res.status(200).send({
            subjects: subjects
        })

    } catch (error) {
      console.log(error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
          message: 'Something went wring during getting subjects!'
      });
    }
})

module.exports = router;