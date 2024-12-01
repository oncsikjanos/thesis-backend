var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
const Database = require('../db/conn.js');

/* Add new user to DB */
router.post('', async (req, res) =>{
    if (!Database.db) {
        return res.status(503).send({ error: 'Database not initialized yet' });
    }

    let collection = await Database.db.collection(process.env.USER_COLLECTION);
    let documentBody = req.body;
    let result = await collection.insertOne(documentBody);
    res.send(result).status(201);
})

module.exports = router;
