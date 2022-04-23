const { response } = require('express');
const bcrypt = require('bcryptjs/dist/bcrypt');
const User = require('../models/User.js');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async( req, res = response ) => {
    // const { name, email, password, avatar, date } = req.body;
    const { email, password } = req.body;    
    
    try {
        let user = await User.findOne({ email });
        if ( user ) {
            return res.status(400).json({
                ok: false,
                msg: 'El Em@il ya existe porfavor agrega otro'
            });
        }

        user = new User( req.body );

        // Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        user.password = bcrypt.hashSync( password, salt );
    
        await user.save();

        // Crear token jwt
        const token = await generarJWT( user.id, user.name, user.email, user.avatar ); 
    
        res.status( 201 ).json({
            ok: true,
            uid: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token,
            mensaje: 'Usuario Creado',
        })
        
    } catch (error) {
        console.log(error);
        res.status( 500 ).json({
            ok: false,
            mensaje: 'Error inesperado hable con el adminitrador',
        });
    }
}

const login = async( req, res = response ) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if ( !user ) {
            return res.status(400).json({
                ok: false,
                errors: {
                    resp: {
                        msg: 'El Usario no existe con ese email'
                    }
                }
            });
        }

        // Validar contraseña
        const validPassword = bcrypt.compareSync( password, user.password );
        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                errors: {
                    resp: {
                        msg: 'Contraseña incorrecta'
                    }
                }
            });
        }

        // Crear token
        const token = await generarJWT( user.id, user.name, user.email, user.avatar ); 

        res.json({
            ok: true,
            uid: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            token,
            mensaje: 'Login correcto',
        });
        
    } catch (error) {
        console.log(error);
        res.status( 404 ).json({
            ok: false,
            errors: {
                resp: {
                    msg: 'Error inesperado hable con el adminitrador',
                    error
                }
            }
        });
    }
    // res.status( 201 ).json( {
    //     ok: true,
    //     mensaje: 'Login',
    //     email,
    //     password
    // })
}

const revalidar = async( req, res = response) => {
    const { uid, name, email, avatar } = req;
    const token = await generarJWT( uid, name, email, avatar ); 

    res.json( {
        ok: true,
        uid,
        name,
        email,
        avatar,
        token,
        mensaje: 'Renew Token',
    })
    
}

module.exports = {
    crearUsuario, 
    login,
    revalidar
}