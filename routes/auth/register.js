var express = require('express');
var router = express.Router();
var dotenv = require('dotenv').config();
var jwt = require('jsonwebtoken');
const {isValidEmail, isValidDateOfBirth, isValidName, checkPasswordCriteria}= require('../../validation/validator.js');

const Database = require('../../db/conn.js');
const { getAuth, createUserWithEmailAndPassword } = require('firebase/auth');
const { ErrorMessages } = require('../../public/stylesheets/messages/error-messages.js');

/* Register a new user */
router.post('', async (req, res) => {
    const auth = getAuth();
    const {email, password, passwordConfirm} = req.body;

    try {
        if (!Database.db) {
            return res.status(503).send({ error: 'Database not initialized yet' });
        }

        user = {
            name: req.body.name,
            email: req.body.email,
            dateOfBirth: req.body.dateOfBirth,
            role: "Student",
            pfp: 'http://localhost:5050/images/pfp/1736890748850-260695854.jpg',
            description: ''
        }

        if (!isValidName(user.name)) {
            return res.status(400).send({ error: 'Name is too short' });
        }

        if (!isValidEmail(user.email)) {
            return res.status(400).send({ error: 'Invalid email address' });
        }

        if (!isValidDateOfBirth(user.dateOfBirth).isValid) {
            return res.status(400).send({ error: isValidDateOfBirth(user.dateOfBirth).message });
        }

        if (!checkPasswordCriteria(password,passwordConfirm).isValid) {
            return res.status(400).send({ error: checkPasswordCriteria(password, passwordConfirm).message });
        }

        const userCredential = await createUserWithEmailAndPassword(auth, email, password);

        let collection = await Database.db.collection(process.env.USER_COLLECTION);
        let result = await collection.insertOne(user);

        const token = jwt.sign(result, process.env.SECRET_KEY, {expiresIn: '1h'});

        res.status(201)
        .cookie('authToken', token, 
            {httpOnly: true,
            secure: true,
            sameSite: 'lax',
            maxAge: 24*60*60*1000})
        .send({success: true,
            message: "User registered successfully",
            user: result});

    } catch (error) {
        res.status(400).send({
            "code": error.code,
            "message": ErrorMessages.AUTH.FIREBASE[error.code]
        });
    }
})



module.exports = router;
