class Booking {
    static database;

    static setDatabase(database) {
        Booking.database = database;
    }

    static create = (booking) => {
        return new Promise((resolve, reject) => {
            this.database.collection('bookings').insertOne(booking).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static read = (query) => {
        return new Promise((resolve, reject) => {
            this.database.collection('bookings').findOne(query).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static readAll = (query) => {
        return new Promise((resolve, reject) => {
            this.database.collection('bookings').find(query).toArray((err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    static update = (booking) => {
        return new Promise((resolve, reject) => {
            const filter = {_id : booking._id};

            const update = {
                $set : {
                    ...Booking
                },
            };

            this.database.collection('bookings').updateOne(filter, update).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static delete = (id) => {
        return new Promise((resolve, reject) => {
            this.database.collection('bookings').deleteOne({_id : id}).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = Booking;