var express = require('express');
var router = express.Router();

const Database = require('../../db/conn.js');

/* Get specific user from DB */
router.get('', async (req, res) =>{

    const query = {
        email: req.user.email
    }

    const user = await Database.db.collection(process.env.USER_COLLECTION).findOne(query)

    res.status(202).send({
        "success" : true,
        "user": user
    })
})

module.exports = router;