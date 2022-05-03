const router = require('express').Router();
const { ObjectId } = require('mongodb');
const { User, Offer, Booking } = require('../utils');

router.get('/', (req, res) => {
    const filter = {
        people_max_count: { $gte: req.body.people_count }
    }

    if (req.body.location) {
        filter.location = req.body.location;
    }

    Offer.readAll(filter).then(async offers => {
        let r = [];

        for (let offer of offers) {
            let c = 0;

            let bookings = await Booking.readAll({ offer_id: offer._id });

            for (let booking of bookings) {
                if ((new Date(booking.date_start) >= new Date(req.body.date_start) && new Date(booking.date_start) <= new Date(req.body.date_end)) || (new Date(booking.date_end) >= new Date(req.body.date_end) && new Date(booking.date_end) <= new Date(req.body.date_end))) {
                    c += booking.people_count;
                }
            }

            if (c + req.body.people_count <= offer.people_max_count) {
                r.push({...offer, people_period_count: c});
            }
        }

        res.status(200).json({
            offers: r,
        }).end();
    });
});

router.get('/:id', (req, res) => {
    Offer.read({ _id: ObjectId.createFromHexString(req.params.id) }).then(async offer => {
        if (offer) {
            let c = 0;

            let bookings = await Booking.readAll({ offer_id: offer._id });
    
            for (let booking of bookings) {
                if ((new Date(booking.date_start) >= new Date(req.body.date_start) && new Date(booking.date_start) <= new Date(req.body.date_end)) || (new Date(booking.date_end) >= new Date(req.body.date_end) && new Date(booking.date_end) <= new Date(req.body.date_end))) {
                    c += booking.people_count;
                }
            }

            if (c + req.body.people_count <= offer.people_max_count) {
                res.status(200).json({
                    offer,
                    people_period_count: c,
                }).end();
            } else {
                res.status(200).json({
                    success: false,
                    message: 'Offer is full',
                }).end();
            }
        } else {
            res.status(404).json({
                success: false,
                message: 'Offer not found',
            }).end();
        }
    });
});

router.post('/:id', (req, res) => {
    User.read({ _id: ObjectId.createFromHexString(req.headers.authorization.replace('JWT ', '')) }).then(user => {
        if (user) {
            Offer.read({ _id: ObjectId.createFromHexString(req.params.id) }).then(async offer => {
                if (offer) {
                    let c = 0;

                    let bookings = await Booking.readAll({ offer_id: offer._id });
            
                    for (let booking of bookings) {
                        if ((new Date(booking.date_start) >= new Date(req.body.date_start) && new Date(booking.date_start) <= new Date(req.body.date_end)) || (new Date(booking.date_end) >= new Date(req.body.date_end) && new Date(booking.date_end) <= new Date(req.body.date_end))) {
                            c += booking.people_count;
                        }
                    }
        
                    if (c + req.body.people_count <= offer.people_max_count) {
                        Booking.create({
                            offer_id: offer._id,
                            user_id: user._id,
                            date_start: req.body.date_start,
                            date_end: req.body.date_end,
                            people_count: req.body.people_count,
                        }).then(booking => {
                            res.status(200).json({
                                succes: true,
                            }).end();
                        }).catch(error => {
                            console.log(error);
                            res.status(500).json({
                                success: false,
                                message: 'Internal Server Error',
                                error,
                            }).end();
                        });
                    } else {
                        res.status(200).json({
                            success: false,
                            message: 'Offer is full',
                        }).end();
                    }
                } else {
                    res.status(404).json({
                        success: false,
                        message: 'Offer not found',
                    }).end();
                }
            });
        } else {
            res.status(401).json({
                success: false,
                message: 'Unauthorized',
            }).end();
        }
    });
});

module.exports = router;