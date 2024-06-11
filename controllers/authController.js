const asyncHandler = require('express-async-handler');
const passport = require('../config/passport');
const jwt = require('jsonwebtoken');

exports.signIn = asyncHandler(async (req, res, next) => {
    // Start authentication operation
    passport.authenticate('local', { session: false }, (err, user, info) => {
        // Attempt to find the user using the local strategy configured in passport
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user,
            });
        }
        // Once found, attempt to log in, opting out of a session method(this will be handled in jwt)
        req.login(user, { session: false }, async (err) => {
            if (err) {
                return res.status(err.status || 500).json({
                    status: 'error',
                    message: err.message,
                });
            }
        });
        // Establish JWT payload 'body'.
        const body = {
            sub: user.id,
            username: user.username,
            membership: user.membership,
        };
        // sign, and attach a token to the body
        const token = jwt.sign(body, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // return the signed jwt token.
        return res.json({ token });
        // and invoke this process immediately.
    })(req, res, next);
});

// TODO
// Signout? How? What is needed?
