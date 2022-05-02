// Require
const express = require('express');
const minify = require('express-minify');
const compression = require('compression');
const cors = require('cors');
const { readdirSync } = require('fs');
const { join } = require('path');
const config = require('../config');
const { Database } = require('./utils');

const db = new Database(config.database);

const app = express();

// Middlewares
app
.use(cors())
.use(minify())
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use(compression())
.use(express.static(join(__dirname, 'public')))

// Routes
readdirSync(join(__dirname, 'routes')).forEach(file => {
    app.use(`/api/${config.api.version}/${file}`, require(join(__dirname, 'routes', file))(db));
});

// Server start
let server = app.listen(8080, () => {
    console.log(`Server started on port ${server.address().port}`);
});

// Secure Server stop on process exit
function cleanExit() {
    if (server) {
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