const mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose');

const userSchema = mongoose.Schema({
    username: String,
    password: String
});

userSchema.plugin(passportLocalMongoose);

userModel = mongoose.model('User', userSchema);
module.exports = userModel;