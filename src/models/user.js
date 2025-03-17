const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const DuplicateKeyError = require('../errors/duplicatedKeyError');
const MissingFieldError = require('../errors/missingKeyError');
const SALT_WORK_FACTOR = 10;

function transformDocument(doc, ret) {
    ret.id = ret._id;  
    delete ret._id;  
    delete ret.__v;  
    delete ret.verificationToken;
    delete ret.isVerified;
    return ret;
}

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
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
        }
    },
    {
        toJSON: { virtuals: true, transform: transformDocument },
        toObject: { virtuals: true, transform: transformDocument }
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

UserSchema.methods.checkPassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

UserSchema.post("save", function (error, doc, next) {
    //Duplicated Key Treatment
    if (error.name === "MongoServerError" && error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return next(new DuplicateKeyError(field, `${field} já está em uso`));
    }

    //Missing key Tretment
    if (error.name === "ValidationError") {
        const field = Object.keys(error.errors)[0];
        return next(new MissingFieldError(field, `${field} é um campo obrigatório`));
    }
    next(error);
  });

UserSchema.post("validate", function (error, doc, next) {
    if (error.name === "ValidationError") {
      const field = Object.keys(error.errors)[0];
      return next(new MissingFieldError(field, `${field} é um campo obrigatório`));
    }
  
    next(error);
});
module.exports = mongoose.model('User', UserSchema);