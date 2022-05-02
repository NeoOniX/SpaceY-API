const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User, BCrypt } = require('../utils');

const getRouter = (passport, jwtOptions) => {
    router.post('/register', (req, res) => {
        User.create({
            ...req.body,
        }).then(result => {
            console.log(result);
            res.status(200).json(result).end();
        }).catch(error => {
            console.log(error);
        });
    });
    
    router.get('/login', passport.authenticate('jwt', { session: false}), (req, res) => {
        res.status(200).json({
            ...req.user,
        }).end();
    }),
    
    router.post('/login', (req, res) => {
        if (req.user) req.logOut();

        User.read({ email: req.body.email }).then(user => {
            BCrypt.hash(req.body.password).then(hash => {
                bcrypt.compare(user.pass, hash, (err, match) => {
                    if (err) {
                        return res.status(500).json({
                            error: err,
                        }).end();
                    }
                    if (match) {
                        const token = jwt.sign({
                            _id: user._id,
                        }, jwtOptions.secretOrKey);

                        return res.status(200).json({
                            token,
                        }).end();
                    } else {
                        return res.status(401).json({
                            error: 'Invalid credentials',
                        }).end();
                    }
                });
            }).catch(error => {
                console.log(error);
            });
        });
    });
}

module.exports = getRouter;