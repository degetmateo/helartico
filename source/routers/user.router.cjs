const { Router } = require('express');
const { userController } = require('../controllers/user/user.controller.cjs');
const router = Router();

router.post('/signup', userController.post);

module.exports = router;