// passport pre-configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const Users = require('../models/user');

// JWT strategy setup
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
opts.issuer = 'DKM blog';
opts.audience = 'DKM-blog.com';
passport.use(
    new JwtStrategy(opts, function (jwt_payload, done) {
        Users.findOne({ id: jwt_payload.sub }, function (err, user) {
            if (err) {
                return done(err, false);
            }
            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
                // maybe redirect to make new account?
            }
        });
    })
);

// Local strategy setup
passport.use(
    new LocalStrategy(async (username, password, done) => {
        try {
            const user = await Users.findOne({ username: username });
            if (!user) {
                return done(null, false, { message: 'Incorrect username' });
            }
            // match bcrypt hashes
            const match = await bcrypt.compare(password, user.password);
            if (!match) {
                // passwords do not match
                return done(null, false, { message: 'Incorrect password.' });
            }
            // Otherwise authentication has passed
            return done(null, user);
        } catch (err) {
            // Any operation errors
            return done(err);
        }
    })
);

module.exports = passport;
