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

function signout(req, res) {

    req.session.logged = false;
    res.redirect('/api/v1/');

}

module.exports.signin = signin;
module.exports.signout = signout;
