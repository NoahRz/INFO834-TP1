// Access the router on Express 
const router = require('express').Router();

// Access the controllers
const controller = require('../controllers/auth');


router.post('/signin', function (req, res) {

    controller.signin(req, res);

});

router.post('/signout', function (req, res) {

    controller.signout(req, res);

});


module.exports = router;