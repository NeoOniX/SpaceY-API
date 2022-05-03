// Require
const express = require('express');
const cors = require('cors');
const { join } = require('path');
const config = require('../config');
const { Database, User, Booking, Offer } = require('./utils');

Database.get(config.database)
.then(db => {
    User.setDatabase(db);
    Booking.setDatabase(db);
    Offer.setDatabase(db);
    
    const app = express();
    
    // Middlewares
    app
    .use(cors())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(express.static(join(__dirname, 'public')))
    
    // Routes
    app
    .use(`/api/${config.api.version}/auth`, require('./routes/auth'))
    .use(`/api/${config.api.version}/offers`, require('./routes/offers'));
    
    // Server start
    let server = app.listen(8080, () => {
        console.log(`Server started on port ${server.address().port}`);
    });
    
    // Secure Server stop on process exit
    function cleanExit() {
        if (server) {
            Database.close();
            server.close(() => {
                console.log("Server stopped.");
            });
            server = null;
        }
    };
    
    process.on('exit', cleanExit);
    process.on('SIGTERM', cleanExit);
    process.on('SIGINT', cleanExit);
    process.on('SIGUSR1', cleanExit);
    process.on('SIGUSR2', cleanExit);
});