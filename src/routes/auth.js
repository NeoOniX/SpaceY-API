let router = require('express').Router();

function getRoute(...args) {

    const db = args[0];

    router.post('/register', (req, res) => {
        res.status(200).end();
    });

    router.get('/login', (req, res) => {
        res.status(200).json({

        }).end();
    }),

    router.post('/login', (req, res) => {
        res.status(200).json({
            token: 
        }).end();
    });
}

module.exports = getRoute;