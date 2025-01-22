var express = require('express');
var router = express.Router();

const Database = require('../../db/conn.js');
const { ObjectId } = require('mongodb');

/* set result */
router.post('', async (req, res) =>{

    try{
        if(req.user.role !== 'admin'){
            return res.status(400).send({
                error: 'You are not an admin' 
            })
        }
    
        if(!req.body.result){
            return res.status(400).send({
                error: 'Didnt got result' 
            })
        }
    
        if(!req.body.id){
            return res.status(400).send({
                error: 'Didnt got id' 
            })
        }
    
        if(req.body.result < 0 || req.body.result > 100){
            return res.status(400).send({
                error: 'Result not in range' 
            })
        }
    
    
        console.log(req.body.id)
    
        const query = {
            teacher: req.user.email,
            result: null,
            status: 'finished',
            _id: new ObjectId(req.body.id)
        }
    
        const setResult = {
            $set:{
                result: req.body.result
            }
        }
    
        await Database.db.collection(process.env.RESULT_COLLECTION).updateOne(query, setResult)
    
        return res.status(202).send({
            "success" : true,
        })

    }catch(e){
        return res.status(400).send({
            error: 'Something went wrong during setting result',
        })
    }

 
})

module.exports = router;