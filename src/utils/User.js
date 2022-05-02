class User {
    static database;

    static setDatabase(database) {
        User.database = database;
    }

    static create = (user) => {
        return new Promise((resolve, reject) => {
            this.database.collection('users').insertOne(user).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static read = (query) => {
        return new Promise((resolve, reject) => {
            this.database.collection('users').findOne(query).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static update = (user) => {
        return new Promise((resolve, reject) => {
            const filter = {_id : user._id};

            const update = {
                $set : {
                    ...user
                },
            };

            this.database.collection('users').updateOne(filter, update).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }

    static delete = (id) => {
        return new Promise((resolve, reject) => {
            this.database.collection('users').deleteOne({_id : id}).then(result => {
                resolve(result);
            }).catch(error => {
                reject(error);
            });
        });
    }
}

module.exports = User;