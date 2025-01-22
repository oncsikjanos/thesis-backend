var express = require('express');
var router = express.Router();

const Database = require('../../db/conn.js');

/* Make user into student */
router.post('', async (req, res) =>{

    try{
        if(req.user.role !== 'admin'){
            return res.status(400).send({
                error: 'You are not an admin' 
            })
        }
    
        if(!req.body.email){
            return res.status(400).send({
                error: 'Didnt got email' 
            })
        }
    
        const query = {
            $and:[
                {email: {$ne: req.user.email}},
                {email: req.body.email},
            ]
        }
    
        const setStudent = {
            $set:{
                role:'student'
            }
        }
    
        await Database.db.collection(process.env.USER_COLLECTION).updateOne(query, setStudent)
    
        return res.status(202).send({
            "success" : true,
        })
    }catch(e){
        return res.status(400).send({
            error: 'Something went wrong during setting to student!',
        })
    }

})

module.exports = router;