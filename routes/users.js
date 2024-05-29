import express from 'express';

import user_controller from '../controllers/userController';

const router = express.Router();

//make sure to secure these
router.get('/', user_controller.listUsers);

router.get('/:id', user_controller.getUser);

router.post('/', user_controller.createUser);

router.put('/:id', user_controller.editUser);

router.delete('/:id', user_controller.deleteUser);

export default router;
