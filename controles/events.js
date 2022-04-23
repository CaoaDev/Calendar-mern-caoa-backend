const { response } = require("express");
const Evento = require("../models/Evento");


const getEvents = async( req, res = response ) => {
    const events = await Evento.find()
                            .populate('user', 'name email avatar').where('user', req.uid);
                                            // el where es para filtrar por el usuario

    res.json({
        ok: true,
        events,
        msg: 'Todos los eventos'
    });
}


const newEvent = async( req, res = response ) => {
    // verificar el evento
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid; // uid del usuario
        // evento.avatar = req.avatar; // avatar del usuario
        // evento.name = req.name; // nombre del usuario
        const eventoDb = await evento.save();
        res.json({
            ok: true,
            evento: eventoDb,
            msg: 'Evento creado'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado hable con el administrador'
        });
    }
}
const updateEvent = async( req, res = response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado'
            });
        }

        // Actualizar el evento
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para actualizar este evento'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updEvent = await Evento.findByIdAndUpdate(eventoId, newEvent, { new: true });
        res.json({
            ok: true,
            updEvent,
            msg: 'Evento actualizado'
        });
        
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado hable con el administrador'
        });
    }
}

const deleteEvent = async( req, res = response ) => {
    const eventoId = req.params.id;
    const uid = req.uid;

    try {
        const evento = await Evento.findById(eventoId);

        if( !evento ) {
            return res.status(404).json({
                ok: false,
                msg: 'Evento no encontrado'
            });
        }

        // Actualizar el evento
        if ( evento.user.toString() !== uid ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tienes permisos para eliminar este evento'
            });
        }

        await Evento.findByIdAndDelete(eventoId);
        res.json({
            ok: true,
            msg: 'Evento Eliminado'
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado hable con el administrador'
        });
    }
}

module.exports = {
    getEvents,
    newEvent,
    updateEvent,
    deleteEvent
}