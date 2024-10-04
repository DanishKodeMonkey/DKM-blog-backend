const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const userQueries = require('../db/prismaQueries');
const { body, validationResult } = require('express-validator');

exports.listUsers = asyncHandler(async (req, res, next) => {
    const allUsers = await userQueries.listUsers();
    if (!allUsers.length) {
        return res.status(404).send('No users found');
    } else {
        res.send(Object.values(allUsers));
    }
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await userQueries.getUser(req.params.userId);

    if (!user) {
        // no results
        console.error(`Something went wrong, user data: ${user}`);
        console.error(`Errors: ${errors}`);
        const err = new Error('User not found');
        err.status = 404;
        return next(err);
    } else res.send(user);
});

exports.createUser = [
    // validate new user data
    body('username', 'Username must be specified')
        .isLength({ min: 1, max: 30 })
        .withMessage('Keep username length between 1 and 30 characters')
        .escape(),
    body('first_name', 'First name must be specified')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Keep first name length between 1 and 30 characters')
        .escape(),
    body('last_name', 'Last name must be specified')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Keep last names between 1 and 30 characters')
        .escape(),
    body('email', 'Email must be specified')
        .trim()
        .isEmail()
        .withMessage('This email adress is invalid')
        .escape(),
    body('password', 'A password is required')
        .trim()
        .isLength({ min: 4, max: 9999 })
        .withMessage(
            'Please ensure passwords are between 4 and 9999 characters'
        ),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        // extract validatio nerrors from request
        const errors = validationResult(req);

        // bcrypt for password
        const hashedPassword = await bcrypt.hash(password, 10);

        // create new user object with verified data
        const newUser = await userQueries.createUser({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: hashedPassword,
            membership: req.body.membership || 'User', //default membership is User
        });

        if (!errors.isEmpty()) {
            console.error(`Something went wrong, user data: ${user}`);
            console.error(`Errors: ${errors}`);
            const err = new Error('User create validation failed');
            err.status = 400;
            return next(err);
        } else {
            return res.status(201).json({
                message: `User ${req.body.username} successfully saved`,
            });
        }
    }),
];

exports.editUser = [
    // validate new user data
    body('username')
        .isLength({ min: 1, max: 30 })
        .withMessage('Keep username length between 1 and 30 characters')
        .escape(),
    body('first_name')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Keep first name length between 1 and 30 characters')
        .escape(),
    body('last_name')
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Keep last names between 1 and 30 characters')
        .escape(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('This email adress is invalid')
        .escape(),
    body('password').optional().trim(),

    // Process request after validation and sanitization
    asyncHandler(async (req, res, next) => {
        console.warn('editUser method triggered... validating data');
        console.log('extracting validation errors from request...');
        console.log('Received request body', req.body);
        // extract validation nerrors from request
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            console.error('An error has occured', errors.array());
            return res.status(400).json({ errors: errors.array() });
        }

        console.log('looking up user...', req.params.userId);
        try {
            const user = await userQueries.getUser(req.params.userId);
            if (!user) {
                console.error('Error, user not found!');
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User found, updating ...');
            const updatedUser = await userQueries.editUser(
                req.params.userId,
                req.body
            );

            console.log('User updated sucessfully!! Operation complete!');
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
    }),
];

exports.deleteUser = asyncHandler(async (req, res, next) => {
    const userId = req.params.userId;

    const user = await userQueries.getUser(userId);

    if (!user) {
        return res.sendStatus(404, 'User not found');
    }
    if (req.user.id !== userId && req.user.membership !== 'Author') {
        return res.sendStatus(403, 'Unauthorized user deletion');
    }
    console.log('Goodbye user: ', user.username);
    await userQueries.deleteUser(userId);
    return res.send('User successfully deleted, goodbye.');
});
