const JWTStrategy = require('passport-jwt').Strategy;
const User = require('./User');

class JWT {
    static use(passport, options = {}) {
        passport.use(new JWTStrategy(options, (jwt_payload, done) => {
            User.read({ _id: jwt_payload }).then(user => {
                if (user) {
                    return done(null, user);
                } else {
                    return done(null, false);
                }
            }).catch(error => {
                return done(error, false);
            });
        }));
    }

    static parse(passport) {
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });

        passport.deserializeUser((id, done) => {
            User.read(id).then(user => {
                done(null, user);
            }).catch(error => {
                done(error, false);
            });
        });
    }
}

module.exports = JWT;