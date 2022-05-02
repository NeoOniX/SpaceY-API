const ExtractJWT = require('passport-jwt').ExtractJwt;

module.exports = {
    // API
    api : {
        version: "1.0.0",
        port: 8080,
    },
    // Database
    database: {
        host: "localhost",
        port: 3306,
        user: "root",
        password: "",
        database: "test",
    },
    // JWT
    jwt : {
        secret: "secret",
        jwtFromRequest: ExtractJWT.fromAuthHeader(),
    }
}