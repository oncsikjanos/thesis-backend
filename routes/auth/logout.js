var express = require('express');
var router = express.Router();

/* Logout user*/
router.get('', async (req, res) =>{
    res.clearCookie('authToken').status(200).send({
        "succes": true,
        "message": "Succesfully logged out"
    })
})

module.exports = router;