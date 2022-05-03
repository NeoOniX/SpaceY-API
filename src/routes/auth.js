const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { User } = require('../utils');

router.post('/register', (req, res) => {
    User.read({ email: req.body.email }).then(existing => {
        if (existing) {
            res.status(200).json({ success: false, message: 'Email already registered' }).end();
        } else {
            User.create({
                ...req.body,
            }).then(result => {
                res.status(200).json({ success: result.acknowledged }).end();
            }).catch(error => {
                console.log(error);
                res.status(500).json({ success: false, message: 'Internal Server Error', error }).end();
            });
        }
    }).catch(error => {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error }).end();
    });
});

router.get('/login', (req, res) => {
    User.read({ _id: ObjectId.createFromHexString(req.headers.authorization.replace('JWT ', '')) }).then(user => {
        res.status(200).json({
            success: user != null,
            user: user,
        }).end();
    }).catch(error => {
        console.log(error);
        res.status(500).json({ success: false, message: 'Internal Server Error', error }).end();
    });
});

router.post('/login', (req, res) => {
    if (req.body.email && req.body.password) {
        User.read(req.body).then(user => {
            res.status(200).json({
                success: user != null,
                token: user ? user._id : null,
            }).end();
        }).catch(error => {
            console.log(error);
            res.status(500).json({ success: false, message: 'Internal Server Error', error }).end();
        });
    } else {
        res.status(400).json({ success: false, message: 'Bad Request' }).end();
    }
});

module.exports = router;