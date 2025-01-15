const jwt = require('jsonwebtoken');

exports.validateAdmin = (req, res, next) => {
    const token = req.cookies.authToken;

    try{
        console.log('adminValidation')
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verify;
        if(!req.user.role === 'admin'){
            throw new Error('User is not an admin');
        }
        next();
    }catch(err){
        return res
        .clearCookie('authToken')
        .status(401)
        .send({
            auth: false,
            error: "Unauthorized, not admin!" });
        }
}