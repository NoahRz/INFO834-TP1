var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

// define the schema for our user model
//we make the distinction between connection through email (called local) or
//through social network

let UserSchema = new Schema({

    firstname: String,
    lastname: String,
    password: String,
    email: {
        type: String,
        unique: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

//  Hash the password before we even save it to the database
UserSchema.pre('save', function (next) {
    var user = this;
    if (!user.isModified('password'))
        return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err)
            return next(err);
        bcrypt.hash(user.password, salt, null, function (err, hash) {
            if (err)
                return next(err);
            user.password = hash;
            next();
        });
    });
})

// compare password in the database and the one that the user type in
UserSchema.methods.comparePassword = function (password) {
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model('User', UserSchema);
