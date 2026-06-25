const { Router } = require('express');
const { authController } = require('../controllers/auth/auth.controller.cjs');

const router = Router();

router.post('/signin', authController.signIn);

module.exports = router;