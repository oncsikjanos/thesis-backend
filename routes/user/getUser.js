var express = require('express');
var router = express.Router();

/* Get specific user from DB */
router.get('', async (req, res) =>{
    res.status(202).send({
        "success" : true,
        "user": req.user
    })
})

module.exports = router;