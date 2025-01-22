var express = require('express');
var router = express.Router();

const Database = require('../../db/conn.js');

/* Get all users from DB */
router.get('', async (req, res) =>{

    const dontWant = {
        email: {$ne: req.user.email}
    }

    const users = await Database.db.collection(process.env.USER_COLLECTION).find(dontWant).toArray();

    res.status(202).send({
        "success" : true,
        "users": users
    })
})

module.exports = router;