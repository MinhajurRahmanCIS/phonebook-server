var jwt = require('jsonwebtoken');
function verifyJWT(req, res, next) {
    const authHeader = req.headers.authentication;
    if (!authHeader) {
        res.send({ message: "unauthorize access" });
        return;
    };
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, function (err, decoded) {
        if (err) {
            res.send({ message: "unauthorize access" });
            return;
        };
        req.decoded = decoded;
        next();
    });
};

module.exports = verifyJWT;