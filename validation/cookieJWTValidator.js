const jwt = require('jsonwebtoken');

exports.validateCookieJWT = (req, res, next) => {
    const token = req.cookies.authToken;

    try{
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verify;
        next();
    }catch(err){
        return res
        .clearCookie('authToken')
        .status(401)
        .send({
            auth: false,
            error: "Unauthorized" });
        }
}