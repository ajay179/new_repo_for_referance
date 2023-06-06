const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        status: 200,
        message: "This is login api page!"
    });
});

router.use('/login',require('./login/login.route'));

module.exports = router;