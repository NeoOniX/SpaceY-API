// Require
const express = require('express');
const minify = require('express-minify');
const session = require('express-session');
const compression = require('compression');
const cors = require('cors');
const passport = require('passport');
const { join } = require('path');
const config = require('../config');
const { Database, JWT, User, Booking, Offer } = require('./utils');

Database.get(config.database)
.then(db => {
    User.setDatabase(db);
    User.database, Booking.database, Offer.database = db;
    
    const app = express();
    
    // Passport setup
    JWT.use(passport, config.jwt);
    JWT.parse(passport);
    
    // Middlewares
    app
    .use(cors())
    .use(minify())
    .use(express.json())
    .use(express.urlencoded({ extended: true }))
    .use(compression())
    .use(express.static(join(__dirname, 'public')))
    .use(session({
        saveUninitialized: true,
        resave: false,
        name: config.session.name,
        secret: config.session.secret,
    }))
    .use(passport.initialize())
    .use(passport.session());
    
    // Routes
    app
    .use(`/api/${config.api.version}/auth`, require('./routes/auth')(passport, config.jwt))
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