class User {
    static database;

    setDatabase(database) {
        User.database = database;
    }

    static create = (user) => {
        return new Promise((resolve, reject) => {
            
        });
    }

    static read = (id) => {
        return new Promise((resolve, reject) => {
            
        });
    }

    static update = (user) => {
        return new Promise((resolve, reject) => {
            
        });
    }

    static delete = (id) => {
        return new Promise((resolve, reject) => {
            
        });
    }
}