const jwt = require('jsonwebtoken');
const authConfig = require('../../config/auth.json');

module.exports = (req, res, next) =>{
    const bearerHeader = req.headers['authorization'];
    
    if(!bearerHeader)
        return res.status(401).send({ error: 'No token provided' });

    const bearer = bearerHeader.split(' '); //dividindo o token no espaço

    if(!bearer.length === 2)
        return res.status(401).send({ error: 'Token error' });

    const bearerToken = bearer[1];

    req.token = bearerToken;

    jwt.verify(req.token,authConfig.secret, (err, decoded) => {
        if (err) return res.status(401).send({ error: 'Token invalid' });
        
        req.userId = decoded.id; 
        return next();  

    });
    
}
  