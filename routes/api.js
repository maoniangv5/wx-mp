let express = require('express');
let router = express.Router();

let user = require('./user/userRoute');

router.use(function(req, res, next) {
   res.header('Access-Control-Allow-Origin', '*');
   next();
});

router.use('/users', user);

module.exports = router;