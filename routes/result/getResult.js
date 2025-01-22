var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();

const { ObjectId } =  require('mongodb');
const Database = require('../../db/conn.js');

/* Get results for user */
router.get('', async (req, res) => {
    try {
        if (!Database.db) {
            return res.status(503).send({ 
                succes: false,
                error: 'Database not initialized yet' });
        }

        if(!req.user.email){
            return res.status(400).send({
                error:'Unauthorized'
            })
        }

        const currentDate = new Date();

        const resultQuery = {
            student: req.user.email,
            $or: [
                {$and: [ 
                    {status: 'not started'},
                    {startTill: {$lte: currentDate}}
                ]},
                {status: 'finished'},
                {$and: [
                    {status: 'started'},
                    {canFillTill: {$lte: currentDate}}
                ]}
            ]
        }

        const myResults = await Database.db.collection(process.env.RESULT_COLLECTION).find(resultQuery).toArray();

        for(result of myResults){
            if(result.status === "finished" && result.result && !result.maxPoints){
                result.show = result.result;
            }
            else if(result.status === "finished" && result.result && result.maxPoints){
                result.show = (result.result / result.maxPoints * 100).toFixed(2);
            }else if(result.status === "finished" && !result.result){
                result.show = 'Waiting for teacher';
            }else if(result.status === "not started"){
                result.show = 'Didnt appear';
            }else if(result.status === "started" && result.points){
                result.show = (result.result / result.maxPoints * 100).toFixed(2);
            }

            const teacherQ = {
                email: result.teacher
            }

            const teacherName = await Database.db.collection(process.env.USER_COLLECTION).findOne(teacherQ);

            result.teacher = teacherName.name;
        }


        console.log(myResults)

        return res.status(200).send({
            results: myResults
        })

    } catch (error) {
      console.log(error);
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      res.status(400).send({
          message: 'Getting results went wrong!'
      });
    }
})

module.exports = router;