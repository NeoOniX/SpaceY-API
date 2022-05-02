const { MongoClient } = require('mongodb');

class Database {
    static client;

    static get(config) {
        return new Promise((resolve, reject) => {
            try {
                this.client = new MongoClient(`mongodb+srv://${config.user}:${config.password}@${config.host}`);

                this.client.connect().then(() => {
                    resolve(this.client.db(config.database));
                }).catch(err => {
                    reject(err);
                });
            } catch (err) {
                reject(err);
            }
        });
    }

    static close() {
        this.client.close();
    }
}

module.exports = Database;