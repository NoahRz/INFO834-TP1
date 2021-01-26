// Access the router on Express 
const router = require('express').Router();

// Access the controllers
const controller = require('../controllers/user');

// CREATE
router.post("/user", (req, res) => {
    controller.createUser(req, res);
});

// READ
router.get("/users", (req, res) => {

    controller.readUsers(req, res);

});

router.get("/user/:id", (req, res) => {

    controller.readUser(req, res);

});

// UPDATE
router.put("/user/:id", (req, res) => {

    controller.updateUser(req, res);

});


// DELETE
router.delete("/user/:id", (req, res) => {

    controller.deleteUser(req, res);

});

module.exports = router;