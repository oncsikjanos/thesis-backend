var express = require('express');
var router = express.Router();

const Database = require('../../db/conn.js');

/* Get teacher name from DB */
router.post('', async (req, res) =>{

    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.body.teacherEmail){
            return res.status(400).send({ 
                succes: false,
                error: 'Didnt get any teacher email' });
        }

        const filter = {
            email: req.body.teacherEmail,
            role: 'admin'
        }

        const wantedQuery = {
            projection: {
                _id: 0,
                name: 1
            }
        }

        let foundUser = await Database.db.collection(process.env.USER_COLLECTION).findOne(filter, wantedQuery);

        if(!foundUser){
        return res.status(200).send({error: "Couldnt find the teacher"});
        }

        return res.status(200).send({user: foundUser});

    } catch (error) {
        console.log(error);
          res.status(400).send({
              message: 'In progress getting teacher something went wrong!',
              error: error.message
          });
      }

})

module.exports = router;