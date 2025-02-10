const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_WORK_FACTOR = 10;

// Schema

const UserSchema = new mongoose.Schema(
    {
        nome: {
            type: String,
            required: true,
        },
        dataNascimento: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
            index: { unique: true },
        },
        password: {
            type: String,
            required: true,
        }
    }
)

UserSchema.pre('save', function(next) {
    var user = this;

    //only hash the password if it has been modified:
    if (!user.isModified('password')) return next();

    //generate a salt:
    bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
        if (err) return next(err);

        //hash the password:
        bcrypt.hash(user.password, salt, function(err, hash) {
            if (err) return next(err);

            //update the password with the hashed one:
            user.password = hash;
            next();
        })
    })
});

UserSchema.methods.checkPassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model('User', UserSchema);