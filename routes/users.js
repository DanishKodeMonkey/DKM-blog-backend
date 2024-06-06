const express = require('express');

const user_controller = require('../controllers/userController');
const passport = require('../config/passport');

const isAuthorized = require('../middleware/isAuthorized');

const router = express.Router();

//make sure to secure these
router.get(
    '/',
    passport.authenticate('jwt', { session: false }),
    user_controller.listUsers
);

router.get(
    '/:userId',
    (req, res, next) => {
        console.log('Route hit: /:userId');
        next();
    },
    passport.authenticate('jwt', { session: false }),
    (req, res, next) => {
        console.log('Passed JWT authentication');
        next();
    },
    isAuthorized,
    (req, res, next) => {
        console.log('Passed isAuthorized middleweare');
        next();
    },
    user_controller.getUser
);

router.post('/', user_controller.createUser);

router.put(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    user_controller.editUser
);

router.delete(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
    user_controller.deleteUser
);

module.exports = router;
