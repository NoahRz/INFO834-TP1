//Access the router on Express 
const router = require('express').Router();

//Access the controllers
const controller = require('../controllers/index');

//READ
router.get("/falsedata", (req, res) => {

    controller.readFalseData(req, res);

});

module.exports = router;