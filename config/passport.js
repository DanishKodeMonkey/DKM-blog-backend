// passport pre-configuration
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const bcrypt = require('bcryptjs');
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const prisma = require('../db/prismaClient');

// JWT strategy setup
var opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
        console.warn('JWT strategy triggered');
        try {
            const user = await prisma.user.findUnique({
                where: {
                    id: jwt_payload.sub,
                },
            });

            if (user) {
                return done(null, user);
            } else {
                return done(null, false);
            }
        } catch (err) {
            return done(err, false);
        }
    })
);

// Local strategy setup
passport.use(
    new LocalStrategy(async (username, password, done) => {
        console.warn('LocalStrategy strategy triggered...');
        try {
            const user = await prisma.user.findFirst({
                where: { username: username },
            });
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
