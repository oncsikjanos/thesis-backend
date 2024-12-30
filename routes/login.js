var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');

const Database = require('../db/conn.js');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

/* Get specific user from DB */
router.post('', async (req, res) =>{
    const {email, password} = req.body;
    const auth = getAuth();

    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }
    
        let collection = Database.db.collection(process.env.USER_COLLECTION);
        let query = {email: userCredential.user.email};
        let result = await collection.findOne(query);
    
        if (!result) {
            res.status(404).send({error: "User not found"});
        } else {
            const token = jwt.sign(result, process.env.SECRET_KEY, {expiresIn: '1h'});
            res.status(200)
            .cookie('authToken', token, {httpOnly: true, secure: true, maxAge: 86400})
            .send({succes: true,
                message: "Succesfully logged in!",
                user: result
            });
        }
    } catch (error) {
        res.status(400).send(error);
    }
})

module.exports = router;