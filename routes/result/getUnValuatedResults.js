var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get results for user */
router.get('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.user.email){
            return res.status(400).send({
                error:'Unauthorized'
            })
        }

        const currentDate = new Date();

        const resultQuery = {
            teacher: req.user.email,
            $and: [
                {status: 'finished'},
                {result: null}
            ]
        }

        const myResults = await Database.db.collection(process.env.RESULT_COLLECTION).find(resultQuery).toArray();

        console.log(myResults)

        return res.status(200).send({
            results: myResults
        })

    } catch (error) {
      return res.status(400).send({
          message: 'Getting results went wrong!'
      });
    }
})

module.exports = router;