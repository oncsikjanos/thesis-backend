const jwt = require('jsonwebtoken');

exports.validateCookieJWT = (req, res, next) => {
    const token = req.cookies.authToken;

    try{
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verify;
        next();
    }catch(err){
        res.clearCookie('authToken');
        return res.status(401)
        .send({
            auth: false,
            error: "Unauthorized" });
        }
}