// import express from "express";
const express = require ( 'express' );
require ( 'dotenv' ).config ();
const cors = require ( 'cors' );
const { dbConecction } = require('./db/config.js');

// Crear Seridor express
const app = express();

//base de datos
dbConecction();

// Configurar cabeceras y cors
app.use( cors() );

// Directorio publico
app.use( express.static( 'public' ) );

// Lectura y parseo del body
app.use( express.json() );

// // Rutas

// TODO: auth // crear, login, renew
app.use( '/api/auth', require( './routes/auth' ) );
// TODO: CRUD: Eventos
app.use( '/api/events', require( './routes/events' ) );

// Escuchar peticions
app.listen( process.env.PORT, () => {
    console.log( `Servidor Activo en Puerto ${ process.env.PORT }` );
});