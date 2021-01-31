//Access the router on Express 
const router = require('express').Router();

const passport = require('passport');

//Access the controllers
const controller = require('../controllers/index');

//READ
router.get("/appel", passport.authenticate('jwt', { session: false }), function (req, res) { // we protect this route

    controller.readAppel(req, res);

});

module.exports = router;