const asyncHandler = require('express-async-handler');

exports.listUsers = asyncHandler(async (req, res, next) => {
    return res.send('Received List users HTTP get method');
});

exports.getUser = asyncHandler(async (req, res, next) => {
    return res.send(
        `Received get user HTTP get method for ${req.params.userId}`
    );
});

exports.createUser = asyncHandler(async (req, res, next) => {
    return res.send('Received create user HTTP get method');
});

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
