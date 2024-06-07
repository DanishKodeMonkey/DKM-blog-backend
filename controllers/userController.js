const asyncHandler = require('express-async-handler');
const Users = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.listUsers = asyncHandler(async (req, res, next) => {
    const allUsers = await Users.find().sort({ username: 1 }).exec();
    if (!allUsers.length) {
        return res.status(404).send('No users found');
    } else {
        res.send(Object.values(allUsers));
    }
});

exports.getUser = asyncHandler(async (req, res, next) => {
    const user = await Users.findById(req.params.userId).exec();

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

        // create new user object with verified data
        const user = new Users({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
        });
        if (!errors.isEmpty()) {
            console.error(`Something went wrong, user data: ${user}`);
            console.error(`Errors: ${errors}`);
            const err = new Error('User create validation failed');
            err.status = 400;
            return next(err);
        } else {
            await user.save();
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
            const user = await Users.findById(req.params.userId);
            if (!user) {
                console.error('Error, user not found!');
                return res.status(404).json({ message: 'User not found' });
            }
            console.log('User found, updating data...');
            user.set({
                username: req.body.username,
                first_name: req.body.first_name,
                last_name: req.body.last_name,
                email: req.body.email,
                password: req.body.password,
            });
            const updatedUser = await user.save();

            console.log('User updated sucessfully!! Operation complete!');
            res.json(updatedUser);
        } catch (error) {
            next(error);
        }
        /* 
        console.log('creating new user object');
        // create new user object with verified data
        const user = new Users({
            username: req.body.username,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            password: req.body.password,
            // remember _id for user update on DB
            _id: req.params.userId,
        });
        console.log('user object created', user);
        if (!errors.isEmpty()) {
            console.error(`Something went wrong, user data: ${user}`);
            console.error(`Errors: ${errors}`);
            const err = new Error('User update validation failed');
            err.status = 400;
            return next(err);
        } else {
            console.log('Trying to update user', user, req.params.userId);
            const updatedUser = await Users.findByIdAndUpdate(
                req.params.userId,
                user,
                { new: true, runValidators: true }
            );
            if (!updatedUser) {
                console.error('404, User not found');
                return res.status(404).send('User not found');
            }
            console.log('Operation successful!');
            res.json(updatedUser);
        } */
    }),
];

exports.deleteUser = asyncHandler(async (req, res, next) => {
    // TODO
    // Make sure to delete any post and comments by user before getting here.
    // Note: If posts does the same, maybe the process can be somewhat automated?
    // Thought: Trigger deleteUser triggers all posts deletePosts triggers all post comments deleteComments.
    // Make sure this is done asynchronously.

    const userId = req.params.userId;

    const user = await Users.findById(userId);

    if (!user) {
        return res.sendStatus(404, 'User not found');
    }
    if (req.user.id !== userId && req.user.membership !== 'Author') {
        return res.sendStatus(403, 'Unauthorized user deletion');
    }

    await Users.findByIdAndDelete(userId);
    return res.send('User successfully deleted, goodbye.');
});
