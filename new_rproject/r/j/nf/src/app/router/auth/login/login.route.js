const express = require('express');
const router = express.Router();
const auth = require('../../../controllers/auth/login/login.controller');

router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is loginq api page!"
    });
});

router.post('/signUp', auth.signUp);
router.post('/userLogin', auth.login);
router.post('/forgotPassword', auth.forgotPassword);
router.post('/changePassword', auth.changePassword);
module.exports = router;