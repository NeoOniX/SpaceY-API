let router = require('express').Router();

function getRoute(...args) {

    const db = args[0];

    router.get('/', (req, res) => {
        res.status(200).json({
            
        }).end();
    });

    router.get('/:id', (req, res) => {
        res.status(200).json({
            
        }).end();
    });

    router.post('/:id', (req, res) => {
        res.status(200).json({
            
        }).end();
    });
}

module.exports = getRoute;