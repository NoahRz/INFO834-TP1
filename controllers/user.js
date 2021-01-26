function createUser(req, res) {
    let User = require('../models/user');
    let newUser = User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        email: req.body.email
    });

    newUser.save()
        .then((savedUser) => {
            res.status(200).json(savedUser); // create token to new user connected

        }, (err) => {
            res.status(400).json(err.message)
        });
}



function readUsers(req, res) {

    let User = require("../models/user");

    User.find({})
        .then((user) => {
            res.status(200).json(user);
        }, (err) => {
            res.status(500).json(err);
        });
}

function readUser(req, res) {

    let User = require("../models/user");

    User.findById({ _id: req.params.id })
        .then((user) => {
            res.status(200).json(user);
        }, (err) => {
            res.status(500).json(err);
        });
}


function updateUser(req, res) {

    let User = require("../models/user");

    User.findByIdAndUpdate({ _id: req.params.id },
        {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            password: req.body.password,
        },
        { new: true })
        .then((updatedUser) => {
            res.status(200).json(updatedUser);
        }, (err) => {
            res.status(500).json(err);
        });
}

function deleteUser(req, res) {

    let User = require("../models/user");

    User.findOneAndRemove({ _id: req.params.id })
        .then((deletedUser) => {
            res.status(200).json(deletedUser);
        }, (err) => {
            res.status(500).json(err);
        });
}

module.exports.createUser = createUser;
module.exports.deleteUser = deleteUser;
module.exports.readUsers = readUsers;
module.exports.readUser = readUser;
module.exports.updateUser = updateUser;
