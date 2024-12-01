var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', (req, res) =>{
  res.send("Test succesful").status(204);
})

module.exports = router;