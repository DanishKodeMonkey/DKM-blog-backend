const asyncHandler = require('express-async-handler');
const Users = require('../models/user');
const { body, validationResult } = require('express-validator');

exports.listUsers = asyncHandler(async (req, res, next) => {
    const allUsers = await Users.find().sort({ username: 1 }).exec();
    if (!allUsers.length) {
        return res.send('No users were found');
    } else {
        res.send(Object.values(allUsers));
    }
});

exports.getUser = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received get user HTTP get method for ${req.params.userId}`
    );
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
            return res.send(400, 'Validation failed');
        } else {
            await user.save();
            return res.send(`User ${req.body.username} successfully saved!`);
        }
    }),
];

exports.editUser = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received edit user HTTP get method for ${req.params.userId}`
    );
});

exports.deleteUser = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received delete user HTTP get method for ${req.params.userId}`
    );
});
