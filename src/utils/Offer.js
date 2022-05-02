class Offer {
    static database;

    static setDatabase(database) {
        Offer.database = database;
    }

    static create = (offer) => {
        return new Promise((resolve, reject) => {
            this.database.collection('offers').insertOne(offer).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static read = (query) => {
        return new Promise((resolve, reject) => {
            this.database.collection('offers').findOne(query).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static update = (offer) => {
        return new Promise((resolve, reject) => {
            const filter = {_id : offer._id};

            const update = {
                $set : {
                    ...offer
                },
            };

            this.database.collection('offers').updateOne(filter, update).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static delete = (id) => {
        return new Promise((resolve, reject) => {
            this.database.collection('offers').deleteOne({_id : id}).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = Offer;