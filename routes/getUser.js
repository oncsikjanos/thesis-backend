var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const Database = require('../db/conn.js');

/* Get specific user from DB */
router.post('', async (req, res) =>{
    if (!Database.db) {
        return res.status(503).send({ error: 'Database not initialized yet' });
    }

    let collection = await Database.db.collection(process.env.USER_COLLECTION);
    let query = {email: req.body.email};
    let result = await collection.findOne(query);

    if (!result) res.send("Not found").status(404);
    else res.send(result).status(200);
})

module.exports = router;