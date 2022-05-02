const JWTStrategy = require('passport-jwt').Strategy;

class JWT {
    static use(passport, options = {}) {
        passport.use(new JWTStrategy(options, (jwt_payload, done) => {
            Database.User.read(jwt_payload).then((user, error) => {
                if (err) {
                    return done(err, false);
                }
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            })
        }));
    }
}