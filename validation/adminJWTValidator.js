const jwt = require('jsonwebtoken');

exports.validateAdmin = (req, res, next) => {
    const token = req.cookies.authToken;

    try{
        console.log('adminValidation')
        const verify = jwt.verify(token, process.env.SECRET_KEY);
        req.user = verify;
        console.log("user.role", req.user.role)
        if(req.user.role !== 'admin'){
            console.log('not admin')
            return res
            .clearCookie('authToken')
            .status(401)
            .send({
                auth: false,
                error: "Unauthorized, not admin!" });
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