/*
    Rutas del usuario (auth)
    host + /api/auth
*/
const { Router } = require ( 'express' );
const { check } = require ( 'express-validator' );
const { crearUsuario , login, revalidar } = require ( '../controles/auth.js' );
const { validarJwt } = require('../middlewares/validar-jwt.js');
const { validarCampos } = require('../middlewares/validarCampos.js');

const router = Router ();
router.post( '/',
    [ // Middlewares
        check( 'email', 'Revisar el em@il' ).isEmail(),
        check( 'password', 'El password es necesario y tiene que tener mas de 4 caracteres' ).not().isEmpty().isLength({ min: 4 }), 
        validarCampos
    ],
    login );
router.post( '/regis', 
    [ // Middlewares
        check( 'name', 'El nombre es necesario y tiene que tener mas de 4 caracteres' ).not().isEmpty().isLength({ min: 4 }),
        check( 'email', 'El em@il no es valido' ).isEmail(),
        check( 'avatar', 'El avatar es necesario' ).not().isEmpty(),
        check( 'password', 'El password es necesario y tiene que tener mas de 4 caracteres' ).not().isEmpty() .isLength({ min: 4 }),
        // check( 'date' ,'La fecha es necesaria' ).isDate(),
        validarCampos
    ],
    crearUsuario );

router.get( '/renew', validarJwt, revalidar );

module.exports = router;