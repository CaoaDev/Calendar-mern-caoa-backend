/*
    Rutas del usuario (auth)
    host + /api/events
*/

// Todos tiene pasar por la validacion de token
// Obtener los eventos
const { Router } = require ( 'express' );
const { check } = require('express-validator');
const { isDate } = require('../helpers/isDate');
const { validarCampos } = require('../middlewares/validarCampos');
const { getEvents, newEvent, updateEvent, deleteEvent } = require('../controles/events');
const { validarJwt } = require('../middlewares/validar-jwt');

const router = Router ();

// Middleware para validar el token
router.use( validarJwt );

router.get( '/', getEvents );

router.post( '/',
    [   /* si quitas .custom( isDate ), quitalo de la importacion */
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'La fecha de unicio es obligatoria').custom( isDate ),
        // check('start', 'La fecha de unicio es obligatoria').isDate(),
        check('end', 'La fializacion es obligatoria').custom( isDate ),
        validarCampos
    ],
    newEvent
);

router.put( '/:id',
    [
        check('title','El titulo es obligatorio').not().isEmpty(),
        check('start','Fecha de inicio es obligatoria').custom( isDate ),
        check('end','Fecha de finalización es obligatoria').custom( isDate ),
        validarCampos
    ],
    updateEvent );

router.delete( '/:id', deleteEvent );

module.exports = router;