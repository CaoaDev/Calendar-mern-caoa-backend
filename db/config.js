const mongoose = require('mongoose');

const dbConecction = async () => {
    try {

        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // useCreateIndex: true
        });

        console.log('DB is online');
    } catch (error) {

        console.log(error.message);
        throw new Error( 'Error en la conexion a la base de datos' );

    }
};

module.exports = {
    dbConecction
};