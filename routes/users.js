const express = require('express');

const user_controller = require('../controllers/userController');

const router = express.Router();

//make sure to secure these
router.get('/', user_controller.listUsers);

router.get('/:userId', user_controller.getUser);

router.post('/', user_controller.createUser);

router.put('/:userId', user_controller.editUser);

router.delete('/:userId', user_controller.deleteUser);

module.exports = router;
