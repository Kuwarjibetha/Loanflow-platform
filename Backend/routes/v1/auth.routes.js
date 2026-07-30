const router = require('express').Router();
const { register, login } = require('../../controllers/v1/auth.controller');

router.post('/register', register);
router.post('/login', login);

module.exports = router;