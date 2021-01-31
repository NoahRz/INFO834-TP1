const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

function createToken(user) {
    return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: 3600 });
}

function signin(req, res) {

    let User = require('../models/user');

    User.findOne({ email: req.body.email })
        .then((user) => {
            if ((user != null) && (user.comparePassword(req.body.password))) {
                req.session.logged = true;
                res.status(200).json({ token: createToken(user), user: user }); // create token to new user connected
            }
            else {
                res.status(400).json({ msg: "Invalid credentials" })
                //res.redirect('/api/v1/'); // or return an error message
            }
        }, (err) => {
            res.status(500).json(err);
        });
}

function signup(req, res) {

    let User = require('../models/user');
    let newUser = User({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        password: req.body.password,
        email: req.body.email
    });

    newUser.save()
        .then((savedUser) => {
            req.session.logged = true;
            res.status(200).json({ token: createToken(savedUser), user: savedUser }); // create token to new user connected

        }, (err) => {
            res.status(400).json(err.message)
        });
}

function signout(req, res) {

    req.session.logged = false;
    res.status(200).json({ msg: "Succesfully disconected" })

}

module.exports.signin = signin;
module.exports.signup = signup;
module.exports.signout = signout;
