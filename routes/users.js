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
    passport.authenticate('jwt', { session: false }),
    isAuthorized,
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
