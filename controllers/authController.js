const asyncHandler = require('express-async-handler');
const Users = require('../models/user');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');

exports.signIn = asyncHandler(async (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
        if (err || !user) {
            return res.status(400).json({
                message: info ? info.message : 'Login failed',
                user: user,
            });
        }
        req.login(user, { session: false }, async err => {
            if (err) {
                return res.status(err.status || 500).json({
                    status: 'error',
                    message: err.message,
                });
            }
        });
        const body = { sub: user.id, username: user.username };
        const token = jwt.sign(body, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });

        return res.json({ token });
    })(req, res, next);
});
