const express = require('express');

const user_controller = require('../controllers/userController');
const passport = require('../config/passport');

const isAuthorized = require('../middleware/isAuthorized');

const router = express.Router();

//make sure to secure these
router.get(
    '/',
    (req, res, next) => {
        console.log('Route hit: GET /');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    user_controller.listUsers
);

router.get(
    '/:userId',
    (req, res, next) => {
        console.log('Route hit: GET /:userId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    user_controller.getUser
);

router.post('/', user_controller.createUser);

router.put(
    '/:userId',
    (req, res, next) => {
        console.log('Route hit: PUT /:userId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    user_controller.editUser
);

router.delete(
    '/:userId',
    (req, res, next) => {
        console.log('Route hit: DELETE /:userId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleware');
        next();
    },
    user_controller.deleteUser
);

module.exports = router;
