const { response } = require("express");
const jwt = require('jsonwebtoken');

const validarJwt = ( req, res = response, next) => {
    // x-auth-token -> headers
    const token = req.header('x-auth-token');
   
    if ( !token ) {
        
        return res.status(401).json({
            ok: false,
            msg: 'No se encurntra ningun Token'
        });
    }
    try {

        const { uid, name, email, avatar } = jwt.verify( 
            token, 
            process.env.JWT_SECRET 
        );
        
        req.uid= uid;
        req.name= name;
        req.email= email;
        req.avatar= avatar;
       
    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token no valido'
        });
    }
    next();
}

module.exports = {
    validarJwt
};